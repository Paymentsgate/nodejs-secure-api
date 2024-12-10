import { AuthenticationRealms, CredentialsTypes, Currencies, CurrencyTypes, FeesStrategy, InvoiceDirection, InvoiceTypes, Languages, Statuses, TTLUnits } from "./enums";

export type EntityWithId = {
  _id: string;
}

// Requests & responses
export type ErrorResponseType = {
  error: string;
  message: string;
  details?: {}; 
  statusCode?: number;
}

export type AccessTokenResponseDTO = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export type AccessTokenRequestDTO = {
  account_id: string;
  public_key: string;
}

export type RecipientCredentialsDTO = {
  account_number: string;
  account_owner?: string;
  account_iban?: string;
  account_swift?: string;
  account_phone?: string;
  account_bic?: string;
  account_ewallet_name?: string;
  account_email?: string;
  aaccount_bank_id?: string;
  type: keyof typeof CredentialsTypes;
}

export type AssetsAccountDTO = {
  currency: CurrencyDTO;
  total: number;
  pending: number;
  available: number;
}

export type AssetsDTO = {
  assets: AssetsAccountDTO[];
}

export type DepositAddressDTO = {
  currency: CurrencyDTO;
  address: string;
  expiredAt: string;
}

export type CreatePayInDTO = {
  amount: number;
  currency: keyof typeof Currencies;
  invoiceId?: string;
  clientId?: string;
  type: keyof typeof InvoiceTypes;
  bankId?: string;
  trusted?: boolean;
  successUrl?: string;
  failUrl?: string;
  backUrl?: string;
  clientCard?: string;
  fingerprint?: {
    fingerprint: string;
    ip: string;
    country: string;
    city: string;
    state: string;
    zip: string;
    browser?: {
      acceptHeader: string;
      colorDepth: number;
      language: string;
      screenHeight: number;
      screenWidth: number;
      timezone: string;
      userAgent: string;
      javaEnabled: boolean;
      windowHeight: number;
      windowWidth: number;
    }
  };
  lang?: keyof typeof Languages;
}

export type CreatePayInResponseDTO = {
  id: string;
  status: keyof typeof Statuses;
  type: keyof typeof InvoiceTypes;
  url: string;
}

export type CreatePayInSyncResponseDTO = RecipientCredentialsDTO & {
  currency: CurrencyDTO;
  bank?: BankDTO;
}

export type CreatePayOutDTO = {
  currency?: keyof typeof Currencies;
  currencyTo: keyof typeof Currencies;
  amount: number;
  invoiceId: string;
  clientId?: string;
  ttl?: number;
  ttl_unit?: keyof typeof TTLUnits;
  finalAmount?: number;
  sender_name?: string;
  baseCurrency: keyof typeof CurrencyTypes;
  feesStrategy: keyof typeof FeesStrategy;
  recipient: RecipientCredentialsDTO;
  quoteId?: GetQuoteResponseDTO['id'];
}

export type CreatePayOutResponseDTO = {
  id: string;
  status: keyof typeof Statuses;
}

export type GetQuoteDTO = {
  currencyFrom: keyof typeof Currencies;
  currencyTo: keyof typeof Currencies;
  amount: number;
}

export type QuoteEntity = {
  currencyFrom: keyof typeof Currencies;
  currencyTo: keyof typeof Currencies;
  pair: string;
  rate: number;
}

export type GetQuoteResponseDTO = {
  id: string;
  finalAmount: number;
  direction: 'C2F' | 'F2C';
  fullRate: number;
  fullRateReverse: number;
  fees: number;
  fees_percent: number;
  quotes: QuoteEntity[]
}

export type DepositAddressResponseDTO = {
  currency: CurrencyDTO;
  address: string;
  expiredAt: Date;
}

// entities
export type CurrencyDTO = EntityWithId & {
  type: keyof typeof CurrencyTypes;
  code: keyof typeof Currencies;
  symbol: string;
  label: string;
  decimal: number;
  countryCode?: string;
  countryName?: string;
}

export type BankDTO = EntityWithId & {
  name: string;
  title: string;
  currency: keyof typeof Currencies;
  fpsId?: string;
}

export type InvoiceDTO = EntityWithId & {
  orderId: string;
  projectId: string;
  currencyFrom: CurrencyDTO;
  currencyTo: CurrencyDTO;
  direction: InvoiceDirection;
  amount: number;
  status: {
    name: Statuses;
    createdAt: Date;
    updatedAt: Date;
  };
  amounts: {
    crypto: number;
    fiat: number;
    fiat_net: number;
  };
  metadata: {
    invoiceId: string;
    clientId: string;
  };
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
}

// Additional schemas
export type AccountCredentialsFileScheme = {
  account_id: string;
  merchant_id: string;
  project_id: string;
  private_key: string;
  public_key: string;
  realm: AuthenticationRealms | '';
}

export type ApiClientConfigEndpoint = {
  endpoint: string;
}

export type ApiClientConfigFromFile = ApiClientConfigEndpoint & {
  filepath: string;
}

export type ApiClientConfigFromKeys = ApiClientConfigEndpoint & {
  accountId: string;
  publicKey: string;
  privateKey: string;
}

export type ApiClientConfig = ApiClientConfigFromKeys & {
  projectId?: string;
  merchantId?: string;
}