# GNC Bridge Front-end

```shell
npm install 
```

```shell
#Run local chain
npx hardhat node --fork https://rpc.ftm.tools/

#Run local gnc 
npx hardhat node --fork https://polygon-mainnet.infura.io/v3/42562fc1754d4557a37d54da6d89a313  --port 8546
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
npx hardhat run scripts/chain_bot.js
```

Update env file:
```javascript
my-app/constants/envConfig.js
```
