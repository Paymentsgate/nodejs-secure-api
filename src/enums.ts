export enum AuthenticationRealms {
  production = 'production',
  sandbox = 'sandbox'
}

export enum Currencies {
  USDT = 'USDT',
  EUR = 'EUR',
  USD = 'USD',
  TRY = 'TRY',
  CNY = 'CNY',
  JPY = 'JPY',
  GEL = 'GEL',
  AZN = 'AZN',
  INR = 'INR',
  AED = 'AED',
  KZT = 'KZT',
  UZS = 'UZS',
  TJS = 'TJS',
  EGP = 'EGP',
  PKR = 'PKR',
  IDR = 'IDR',
  BDT = 'BDT',
  GBP = 'GBP',
  RUB = 'RUB',
  THB = 'THB',
  KGS = 'KGS',
  PHP = 'PHP',
  ZAR = 'ZAR',
  ARS = 'ARS',
  GHS = 'GHS',
  KES = 'KES',
  NGN = 'NGN',
  AMD = 'AMD'
}

export enum Languages {
  EN = 'EN',
  IN = 'IN',
  AE = 'AE',
  TR = 'TR',
  GE = 'GE',
  RU = 'RU',
  UZ = 'UZ',
  AZ = 'AZ'
}

export enum Statuses {
  queued = 'queued',
  new = 'new',
  pending = 'pending',
  paid = 'paid',
  completed = 'completed',
  disputed = 'disputed',
  canceled = 'canceled'
}

export enum CurrencyTypes {
  fiat = 'fiat',
  crypto = 'crypto'
}

export enum InvoiceTypes {
  p2p = 'p2p',
  ecom = 'ecom',
  c2c = 'c2c',
  m10 = 'm10',
  mpay = 'mpay',
  sbp = 'sbp',
  sbpqr = 'sbpqr',
  iban = 'iban',
  upi = 'upi',
  imps = 'imps',
  spei = 'spei',
  pix = 'pix',
  rps = 'rps',
  ibps = 'ibps',
  bizum = 'bizum',
  rkgs = 'rkgs',
  kgsphone = 'kgsphone',
  krungthainext = 'krungthainext',
  sber = 'sber',
  kztphone = 'kztphone',
  accountbdt = 'accountbdt',
  alipay = 'alipay',
  accountegp = 'accountegp',
  accountphp = 'accountphp',
  sberqr = 'sberqr',
  maya = 'maya',
  gcash = 'gcash',
  banktransferphp = 'banktransferphp',
  banktransferars = 'banktransferars',
  phonepe = 'phonepe',
  freecharge = 'freecharge',
  instapay = 'instapay',
  vodafonecash = 'vodafonecash',
  razn = 'razn',
  rtjs = 'rtjs',
}

export enum CredentialsTypes {
  iban = 'iban',
  phone = 'phone',
  card = 'card',
  fps = 'fps',
  account = 'account',
  custom = 'custom',
}

export enum RiskScoreLevels {
  unclassified = 'unclassified',
  hr = 'hr', // highest risk
  ftd = 'ftd', // high risk
  trusted = 'trusted', // low risk
}

export enum CancellationReason {
  NO_MONEY = 'NO_MONEY',
  CREDENTIALS_INVALID = 'CREDENTIALS_INVALID',
  EXPIRED = 'EXPIRED',
  PRECHARGE_GAP_UPPER_LIMIT = 'PRECHARGE_GAP_UPPER_LIMIT',
  CROSS_BANK_TFF_LESS_THAN_3K = 'CROSS_BANK_TFF_LESS_THAN_3K',
  CROSS_BANK_UNSUPPORTED = 'CROSS_BANK_UNSUPPORTED',
}

export enum FeesStrategy {
  add = 'add',
  sub = 'sub',
}

export enum InvoiceDirection {
  F2C = 'F2C',
  C2F = 'C2F'
}

export enum TTLUnits {
  sec = 'sec',
  min = 'min',
  hour = 'hour'
}