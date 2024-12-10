import { ApiClient } from '@paymentsgate/nodejs-secure-api';
import { Config } from './constant';

(async () => {
  const client = new ApiClient(Config);

  try {
      const result = await client.createPayOut({
        currencyTo: 'EUR',
        amount: 5.20,
        baseCurrency: 'fiat',
        feesStrategy: 'add',
        invoiceId: String(new Date().getTime()),
        clientId: String(new Date().getTime()),
        recipient: {
          account_number: '4723040000861512',
          account_owner: 'CARD HOLDER',
          type: 'card'
        }
      });

    console.log(result);
  } catch(e){
    console.log(e);
  }
})();