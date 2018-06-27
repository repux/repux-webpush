# Setup

## Develop setup

### Install

```sh
npm install
```

### Run web serwer

```sh
npm run server:dev
```

### Run demon (for watching blockchain events)

```sh
npm run demon:dev
```

## Production setup.

```sh
npm install
npm run demon:start
npm run server:start
```


## How to test: Ganache blockchain test commands.

### Register one subscriber

Example request to server with subscription object:

```sh
curl -X POST http://localhost:3000/register -H 'Content-Type: application/json' -d '{"address":"0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97", "subscription": {"endpoint":"https://fcm.googleapis.com/fcm/send/df-87fmapYM:APA91bGD64N_Zd3XekpsdE5S0QGPHTqnO3S-jhLWnw9tT1eqejH3tqaSIl71x7zhREizR_Uv1ll8g8zt1UgmRn3_ctqsgiGt49ufLjVR-Lac8Bliil7Fmm4HpN1r114Eetx8bgnjxPO0","expirationTime":null,"keys":{"p256dh":"BB5xZXao9sdI_caC2WC5e6u8PiaCrMPGzXqzoNGsUY8vmYnBIVmIAbfCRUoHutdP5Pc5m1YBICsHk2i6m801z5Q","auth":"0hCyjijw9vjWQlVBgp_FDw"}}}'
````

### Init

To fire events you need to take all way from create product to approve. 
Run in on ganache console.

```sh
ganache-cli -s
```

Then in ganache console: 

```js
var registry = Registry.at(Registry.address); 
var demoToken = DemoToken.at(DemoToken.address); 
var seller = web3.eth.accounts[0]; 
var buyer = web3.eth.accounts[1];  
demoToken.issue(buyer, 1000000000000000000000000);
```

### Product life cycle

#### 1. Seller create product

```js
var dataProductAddress = null; registry.createDataProduct("hash", 1).then((tx) => {dataProductAddress = tx.logs[0].args.dataProduct});
var dataProduct = DataProduct.at(dataProductAddress);
```

#### 2. Buyer aproove and purchase

```js
demoToken.approve(dataProductAddress, 1, {from: buyer});
// you can verify it: demoToken.allowance.call(buyer, dataProductAddress);
dataProduct.purchase("somePublicKey", {from: buyer});
```

#### 3. Seller approve

```js
dataProduct.approve(buyer, "sellerMetaHash");
````