import { ApiClient } from '@paymentsgate/nodejs-secure-api';
import { Config } from './constant';

(async () => {
  const client = new ApiClient(Config);

  try {
    const result = await client.quote({
      currencyFrom: 'RUB',
      currencyTo: 'EUR',
      amount: 5.20,
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
})();