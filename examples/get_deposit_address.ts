import { ApiClient } from '@paymentsgate/nodejs-secure-api';
import { Config } from './constant';

(async () => {
  const client = new ApiClient(Config);

  try {
    console.log(await client.getDepositAddress());
  } catch (e) {
    console.log(e);
  }
})();