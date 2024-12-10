import { ApiClient } from '@paymentsgate/nodejs-secure-api';
import { Config } from './constant';

(async () => {
  const client = new ApiClient(Config);

  try {
    console.log(await client.getStatus('A10791723821'));
  } catch (e) {
    console.log(e);
  }
})();