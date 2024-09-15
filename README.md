# GNC Bridge Front-end


```shell
npx hardhat node --fork https://rpc.ftm.tools/
```


```shell
npx hardhat run --network local scripts/gnc_bridge_deploy.js
npx hardhat run --network local scripts/chain_bridge_deploy.js
npx hardhat run --network local scripts/token_deploy.js 
```


```shell
npx hardhat run --network local scripts/transfer.js
```

Update env file:
my-app/constants/envConfig.js