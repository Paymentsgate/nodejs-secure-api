# Payments Gate NodeJS Client

This is a complete NodeJS module for communication with paymentsgate service.

## Features

- PayIn orders with out own widget (redirect)
- Payin H2H (sync and async mode)
- PayOut orders
- Quotes (pre-payout quote calculate)
- Account balance with pending funds
- TRC20 deposit address requests

## Dependencies
- [dayjs](github.com/iamkun/dayjs) - lightweight library for date-time manipulation
- [jwt-decode](https://github.com/auth0/jwt-decode) - JWT parser

## Usage


```sh
npm i @paymentsgate/nodejs-secure-api
```

```typescript
import { ApiClient } from '@paymentsgate/nodejs-secure-api'; 

const client = new ApiClient({
  endpoint: 'https://api.example.com',
  filepath: './credentials.json'
});

//// .......... ////

const result = await client.createPayIn({
  amount: 10,
  currency: 'AZN',
  invoiceId: String(new Date().getTime()),
  clientId:  String(new Date().getTime()),
  successUrl: 'https://example.com/success',
  failUrl: 'https://example.com/fail',
  type: 'p2p'
});
```

The `credentials.json` file is used to connect to the client and contains all necessary data to use the API. 
This file can be obtained in your personal cabinet, in the service accounts section. Follow the instructions in the documentation to issue new keys. 
If you already have keys, but you don't feel comfortable storing them in a file, you can use client initialization via variables. In this case, the key data can be stored in external storage instead of on the file system:
```typescript
import { ApiClient } from '@paymentsgate/nodejs-secure-api'; 

const client = new ApiClient({
  endpoint: 'https://api.example.com',
  accountId: '00000000-4000-4000-0000-00000000000a',
  publicKey: 'LS0tLS1CRUdJTiBSU0EgUFJJVkFUNSUlFb3dJQk....',
  privateKey: 'LS0tLS1CRUdJTiklqQU5CZ2txaGtpRzl3MEJBUUV....'
});
```
*It is important to note that the data format for key transfer is base46.

## Examples

**Request QUOTE**
```typescript
const result = await client.quote({
  currencyFrom: 'USDT',
  currencyTo: 'AZN',
  amount: 5.20,
});
```
Response: 
```typescript
{
  id: "6462c5d3-3a50-4b7f-aae4-8e2e909d7a35"
  finalAmount: 8.41,
  direction: 'C2F',
  fullRate: 1.78,
  fullRateReverse: 0.021,
  fees: 0.5,
  fees_percent: 0.012,
  quotes: [
    {
      currencyFrom: 'USDT',
      currencyTo: 'AZN',
      pair: 'USDT/AZN',
      rate: 1.69
    },
  ]
}
```
**Use QUOTE response for next request**

```typescript
const result = await client.createPayOut({
  currencyTo: 'EUR',
  amount: 5.20,
  baseCurrency: 'fiat',
  feesStrategy: 'add',
  invoiceId: 'INVOICE-112123123',
  recipient: {
    account_number: '4000000000000012',
    account_owner: 'CARD HOLDER',
    type: 'card'
  },
  quoteId: '6462c5d3-3a50-4b7f-aae4-8e2e909d7a35'
});
```
## Available currencies
``
EUR
USD
TRY
CNY
JPY
GEL
AZN
INR
AED
KZT
UZS
TJS
EGP
PKR
IDR
BDT
GBP
RUB
THB
KGS
PHP
ZAR
ARS
GHS
KES
NGN
AMD
``
## Available payment methods
``
visa 
mastercard
m10
mpa
sbp
upi
ibps
bizum
kgsphone
krungthainext
kztphone
accountbdt
alipay
accountegp
accountphp
maya
mir
gcash
banktransferphp
banktransferars
freecharge
instapay
vodafonecash
``