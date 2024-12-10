export const UserAgent = 'paymentsgate.nodejs-secure-api';
export const PRIMARY_CRYPTO_CURRENCY_ID = 'ccbfac34-75d1-4fad-ba78-4583f4207ffe';
export const ApiEndpoints = {
  token: {
    issue: '/auth/token',
    refresh: '/auth/token/refresh',
    revoke: '/auth/token/revoke',
    validate: '/auth/token/validate'
  },
  invoices: {
    payin: '/deals/payin',
    payout: '/deals/payout',
    info: '/deals/:id',
    credentials: '/deals/:id/credentials'
  },
  assets: {
    list: '/wallet',
    deposit: '/wallet/deposit'
  },
  banks: {
    list: '/banks/find'
  },
  appel: {
    create: '/support/create',
    list: '/support/list',
    stat: '/support/statistic'
  },
  fx: {
    quote: '/fx/calculation'    
  }
};
