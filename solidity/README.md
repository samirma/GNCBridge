# GNC Bridge Front-end

```shell
npm install 
```

```shell
npx hardhat node --fork https://rpc.ftm.tools/
```


```shell
npx hardhat run --network local scripts/transfer.js

npx hardhat run --network local scripts/gnc_bridge_deploy.js
npx hardhat run --network local scripts/chain_bridge_deploy.js
npx hardhat run --network local scripts/token_deploy.js 
```

```shell
npx hardhat run scripts/chain_bot.js
```

Update env file:
```javascript
my-app/constants/envConfig.js
```
