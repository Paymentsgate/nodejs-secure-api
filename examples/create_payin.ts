import { ApiClient } from '@paymentsgate/nodejs-secure-api';
import { Config } from './constant';

(async () => {
  const client = new ApiClient(Config);

  try {
    const result = await client.createPayIn({
      amount: 10,
      currency: 'AZN',
      invoiceId: String(new Date().getTime()),
      clientId: String(new Date().getTime()),
      successUrl: 'https://example.com/success',
      failUrl: 'https://example.com/fail',
      type: 'p2p'
    });

    console.log(result);
  } catch(e){
    console.log(e);
  }
})();