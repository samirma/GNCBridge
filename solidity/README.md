# GNC Bridge Front-end

```shell
npm install 
```

```shell
#Run local1 chain
HARDHAT_CHAIN_ID=0xfa npx hardhat node --fork https://rpc.ftm.tools/

#Run local2 gnc 
HARDHAT_CHAIN_ID=0xa86a npx hardhat node --fork https://api.avax.network/ext/bc/C/rpc  --port 8546
```


```shell
npx hardhat run --network local1 scripts/transfer.js
npx hardhat run --network local2 scripts/transfer.js
```

#Deploy on chain
```shell
npx hardhat run --network local1 scripts/chain_bridge_deploy.js
npx hardhat run --network local1 scripts/token_deploy.js 
```


#Deploy on GNC
```shell
npx hardhat run --network local2 scripts/gnc_bridge_deploy.js

```

```shell
npx hardhat run scripts/bot.js
```

Update env file:
```javascript
my-app/constants/envConfig.js
```
