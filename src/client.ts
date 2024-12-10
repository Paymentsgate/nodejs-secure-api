import { ApiEndpoints, PRIMARY_CRYPTO_CURRENCY_ID, UserAgent } from "./constants";
import { AccessTokenRequestDTO, AccessTokenResponseDTO, AccountCredentialsFileScheme, ApiClientConfig, ApiClientConfigFromFile, ApiClientConfigFromKeys, AssetsDTO, CreatePayInDTO, CreatePayInResponseDTO, CreatePayInSyncResponseDTO, CreatePayOutDTO, CreatePayOutResponseDTO, DepositAddressResponse, DepositAddressResponseDTO, ErrorResponseType, GetQuoteDTO, GetQuoteResponseDTO, InvoiceDTO } from "./types";

import { jwtDecode } from 'jwt-decode';

import * as https from 'https';
import * as fs from 'fs';
import * as crypto from 'crypto';
import dayjs from 'dayjs';

import { ApiClientError, DefaultErrorMessage, ErrorConfigEndpointInvalidUrl, ErrorConfigFileNotParsed, ErrorConfigMismatch, ErrorCredentialsNotFound, ErrorForbiddenRequest, ErrorRequestProcessed, ErrorUnauthorizedRequest } from "./errors";

type StoreKeys = 'accessToken' | 'refreshToken' | 'publicKey' | 'privateKey' | 'accountId';
const Store = new Map<StoreKeys, string>();

export class ApiClient {
  private uri: URL;
  private debug = false;
  private projectId?: string;
  private merchantId?: string;
  private realm?: string;

  constructor(config: ApiClientConfigFromFile | ApiClientConfigFromKeys) {
    if (!config.endpoint) {
      throw new ErrorConfigEndpointInvalidUrl({
        cause: 'Url is empty' 
      });
    }

    try {
      this.uri = new URL(config.endpoint);
    } catch (e: any) {
      throw new ErrorConfigEndpointInvalidUrl({
        url: config.endpoint,
        cause: e.message
      });
    }

    if ((config as ApiClientConfigFromFile).filepath) {
      const filepath = (config as ApiClientConfigFromFile).filepath;
      try {
        const parsed = JSON.parse(fs.readFileSync(filepath).toString('utf-8')) as AccountCredentialsFileScheme;

        if (!parsed.account_id) {
          throw new ErrorConfigFileNotParsed({
            filepath: filepath,
            cause: 'account_id is empty',
          })
        }

        if (!parsed.public_key) {
          throw new ErrorConfigFileNotParsed({
            filepath: filepath,
            cause: 'public_key is empty',
          })
        }

        if (!parsed.private_key) {
          throw new ErrorConfigFileNotParsed({
            filepath: filepath,
            cause: 'private_key is empty',
          })
        }

        this.projectId = parsed.project_id;
        this.merchantId = parsed.merchant_id;
        this.realm = parsed.realm;

        Store.set('accountId', parsed.account_id);
        Store.set('publicKey', parsed.public_key);
        Store.set('privateKey', parsed.private_key);

        return;
      } catch (e: any) {
        throw new ErrorConfigFileNotParsed({
          filepath: filepath,
          cause: e.message,
        })
      }
    }

    if ((config as ApiClientConfigFromKeys).publicKey && (config as ApiClientConfigFromKeys).privateKey && (config as ApiClientConfigFromKeys).accountId) {
      const cfg = config as ApiClientConfigFromKeys;

      Store.set('publicKey', cfg.publicKey);
      Store.set('privateKey', cfg.privateKey);
      Store.set('accountId', cfg.accountId);

      return;
    }

    throw new ErrorConfigMismatch({});
  }

  public async getAssets(): Promise<AssetsDTO> {
    return this.call<AssetsDTO>('GET', ApiEndpoints.assets.list);
  }

  public async getDepositAddress(): Promise<DepositAddressResponseDTO> {
    return this.call<DepositAddressResponseDTO>('GET', `${ApiEndpoints.assets.deposit}?currencyId=${PRIMARY_CRYPTO_CURRENCY_ID}`);
  }

  public async createPayIn(params: CreatePayInDTO): Promise<CreatePayInResponseDTO> {
    return this.call<CreatePayInResponseDTO, CreatePayInDTO>('POST', ApiEndpoints.invoices.payin, params);
  }

  public async createPayInSync(params: CreatePayInDTO, TTLSeconds: number = 15, RetryDelaySeconds: number = 1): Promise<CreatePayInSyncResponseDTO> {
    return new Promise(async (resolve, reject) => {
      const timeEnd = new Date().getTime() + TTLSeconds * 1000;
      const result = await this.call<CreatePayInResponseDTO, CreatePayInDTO>('POST', ApiEndpoints.invoices.payin, params).catch((error) => reject(error));
      if (!result || result.status !== 'new') {
        return reject(new ErrorCredentialsNotFound({
          cause: 'canceled_by_service'
        }));
      }

      let inProcess = false;
      const interval = setInterval(async () => {
        if (inProcess) return;
        inProcess = true;

        try {
          const credentials = await this.call<CreatePayInSyncResponseDTO>('GET', ApiEndpoints.invoices.credentials.replace(':id', result.id));

          if (credentials) {
            clearInterval(interval);
            return resolve(credentials);
          }
        } catch (e: any) {
          if (e.error === 'ERROR_CREDENTIALS_NOT_FOUND') {
            if (this.debug) {
              console.log('Find in process....');
            }
          }

          if (e.error === 'DEAL_CANCELED') {
            clearInterval(interval);
            return reject( new ErrorCredentialsNotFound({
              cause: 'credentials_find_timeout'
            }));
          }
        }


        const now = new Date().getTime();
        if (now > timeEnd) {
          clearInterval(interval);
          return reject(new ErrorCredentialsNotFound({
            cause: 'credentials_find_timeout'
          }));
        }

        inProcess = false;
      }, RetryDelaySeconds * 1000)
    })
  }

  public async getStatus(id: string): Promise<InvoiceDTO> {
    return this.call<InvoiceDTO>('GET', ApiEndpoints.invoices.info.replace(':id', id));
  }

  public async createPayOut(params: CreatePayOutDTO): Promise<CreatePayOutResponseDTO> {
    return this.call<CreatePayOutResponseDTO, CreatePayOutDTO>('POST', ApiEndpoints.invoices.payout, params);
  }

  public async quote(params: GetQuoteDTO): Promise<GetQuoteResponseDTO> {
    return this.call<GetQuoteResponseDTO>('GET', `${ApiEndpoints.fx.quote}?amount=${params.amount}&currency_from=${params.currencyFrom}&currency_to=${params.currencyTo}`);
  }

  public setDebug(debug: boolean) {
    this.debug = debug;
  }

  // private
  private getHeaders() {
    const headers: {[key: string]: string} = {
      Accept: 'application/json',
      'Accept-Encoding': 'deflate',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': UserAgent,
      Host: this.uri.hostname,
      Origin: 'https://' + this.uri.hostname,
      pragma: 'no-cache',
    }

    return headers;
  }

  private getRequestOptions(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path?: string) {
    return {
      hostname: this.uri.hostname,
      port: this.uri.port || 443,
      path: path || '/',
      method: method,
      headers: this.getHeaders(),
    } as https.RequestOptions;
  }

  private async updateToken(isRenew = false): Promise<void> {
    const accessToken = Store.get('accessToken');
    const refreshToken = Store.get('refreshToken');

    if (accessToken && !isRenew) { 
      const payload = jwtDecode<{ exp: number }>(accessToken);
      const expired = dayjs.unix(payload.exp || 0);
      const diff = expired.diff(dayjs(), 'second');

      // token not expired
      if (diff > 0) return;
    }

    if (refreshToken) {
      const options = this.getRequestOptions('POST', ApiEndpoints.token.refresh);
      const payload = {
        refresh_token: refreshToken
      };

      try {
        const result = await this.doRequest<AccessTokenResponseDTO>(options, payload);
        Store.set('accessToken', result.access_token);
        Store.set('refreshToken', result.refresh_token);
      } catch (e) {
        if (e instanceof ErrorUnauthorizedRequest) {
          if (isRenew) throw e;
          Store.set('accessToken', '');
          Store.set('refreshToken', '');
          return await this.updateToken(true);
        }

        throw e;
      }

      return;
    }

    Store.set('accessToken', '');
    Store.set('refreshToken', '');

    const options = this.getRequestOptions('POST', ApiEndpoints.token.issue);
    const payload = {
      account_id: Store.get('accountId'),
      public_key: Store.get('publicKey'),
    } as AccessTokenRequestDTO;

    const result = await this.doRequest<AccessTokenResponseDTO>(options, payload);
    Store.set('accessToken', result.access_token);
    Store.set('refreshToken', result.refresh_token);

    return;
  }

  private async call<T, P = {}>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, payload?: P): Promise<T>
  {
    await this.updateToken();
    const options = this.getRequestOptions(method, path);
    this.patchRequestOptions(options);

    try {
      return await this.doRequest<T>(options, payload);
    } catch (error) {
      if (error instanceof ErrorUnauthorizedRequest) {
        await this.updateToken();
        this.patchRequestOptions(options);
        return this.doRequest<T>(options, payload);
      }
      throw error;
    }
  }

  private doRequest<T>(options: https.RequestOptions, payload?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      let status;
      const req = https.request(options, (result) => {
        const buffer: string[] = [];
        result.on('data', (data: Buffer) => buffer.push(data.toString('utf-8')));

        result.on('end', () => {
          if (this.debug) {
            console.log(`${options.method}: ${options.path} [${result.statusCode}]`, 'data:', payload);
          }

          if (result.statusCode !== undefined && result.statusCode > 302) {
            try {
              const data = JSON.parse(buffer.join('')) as ErrorResponseType;
              const error = new DefaultErrorMessage({
                code: data.statusCode || result.statusCode,
                method: options.method,
                path: options.path,
                payload: payload,
              });
              error.error = data.error;
              error.message = data.message;
              error.data = data.details || {};
              reject(error);
              return;
            } catch (e) {
              //
            }
          }
          

          if (result.statusCode == 401 || result.statusCode == 400) {
            reject(
              new ErrorUnauthorizedRequest({
                code: 401,
                method: options.method,
                path: options.path,
                payload: payload,
                cause: result.statusMessage
              })
            );
            return;
          }

          if (result.statusCode == 403) {
            reject(
              new ErrorForbiddenRequest({
                code: 403,
                method: options.method,
                path: options.path,
                payload: payload,
                cause: result.statusMessage
              })
            );
            return;
          }

          if (result.statusCode == 429) {
            reject(
              new ErrorRequestProcessed({
                code: 429,
                method: options.method,
                path: options.path,
                payload: payload,
                cause: result.statusMessage
              })
            );
            return;
          }

          if (
            result.statusCode == 302 ||
            result.statusCode == 301 ||
            result.statusCode == 303
          ) {
            reject(
              new ErrorRequestProcessed({
                code: 301,
                method: options.method,
                path: options.path,
                payload: payload,
                location: result.headers.location,
                cause: 'Unprocessed redirect'
              })
            );
            return;
          }

          if (
            result.statusCode != 200 &&
            result.statusCode != 201 &&
            result.statusCode != 202
          ) {
            reject(
              new ErrorRequestProcessed({
                code: result.statusCode,
                method: options.method,
                path: options.path,
                payload: payload,
                location: result.headers.location,
                cause: 'Unknown error'
              })
            );
            return;
          }


          const data = buffer.join('');
          if (data.length === 0) {
            resolve({} as T);
          }
          try {
            const data = buffer.join('');
            const parsed = JSON.parse(data) as T;
            resolve(parsed);
          } catch (e: unknown) {
            reject(
              new ErrorRequestProcessed({
                code: 500,
                method: options.method,
                path: options.path,
                payload: payload,
                cause: 'Error parse response'
              })
            );
          }
        });
      });

      req.on('error', (e: any) => {
        reject(
          new ErrorRequestProcessed({
            code: 500,
            method: options.method,
            path: options.path,
            payload: payload,
            cause: e.message
          })
        );
      });

      if (options.method !== 'GET') {
        req.write(JSON.stringify(payload || {}));
      }

      req.end();
    });
  }

  private patchRequestOptions(options: https.RequestOptions) {
    const token = Store.get('accessToken');
    if (token && options.headers) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  }
}
