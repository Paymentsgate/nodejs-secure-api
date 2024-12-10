export interface ApiClientError {
  error: string;
  message: string;
  data?: any;
}

export class DefaultErrorMessage implements ApiClientError {
  public error: string;
  public message: string;
  constructor(public data: any) {

  }
}

export class ErrorConfigFileNotParsed implements ApiClientError {
  public error = 'ERROR_CONFIG_FILE_NOT_PARSER';
  public message: 'Config file not parsed, or file incorrect';
  constructor(public data: any) {

  }
}

export class ErrorConfigMismatch implements ApiClientError {
  public error = 'ERROR_CONFIG_MISMATCH';
  public message: 'Configuration mismatch';
  constructor(public data: any) {

  }
}

export class ErrorConfigFileNotFound implements ApiClientError {
  public error = 'ERROR_CONFIG_FILE_NOT_FOUND';
  public message: 'Config file not found';
  constructor(public data: any) {

  }
}

export class ErrorConfigEndpointInvalidUrl implements ApiClientError {
  public error = 'ERROR_CONFIG_ENDPOINT_INVALID_URL';
  public message: 'Endpoint is not valid url';
  constructor(public data: any) {

  }
}

export class ErrorRequestProcessed implements ApiClientError {
  public error = 'ERROR_API_REQUEST';
  public message: 'Unknown error on api request';
  constructor(public data: any) {

  }
}

export class ErrorRefreshToken implements ApiClientError {
  public error = 'ERROR_REFRESH_TOKEN';
  public message: 'Refresh token not possible';
  constructor(public data: any) {

  }
}

export class ErrorUnauthorizedRequest implements ApiClientError {
  public error = 'ERROR_UNAUTHORIZED_REQUEST';
  public message: 'Unauthorized request';
  constructor(public data: any) {

  }
}

export class ErrorForbiddenRequest implements ApiClientError {
  public error = 'ERROR_FORBIDDEN_REQUEST';
  public message: 'Request not allowed';
  constructor(public data: any) {

  }
}

export class ErrorCredentialsNotFound implements ApiClientError {
  public error = 'ERROR_CREDENTIALS_NOT_FOUND';
  public message: 'Credentials not found';
  constructor(public data: any) {

  }
}