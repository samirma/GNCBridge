require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });


module.exports = {
  networks: {
    hardhat: {
      chainId: Number(process.env.HARDHAT_CHAIN_ID) || 1337,
    },
    local1: {
      url: `http://127.0.0.1:8545/`,
      accounts: [process.env.privateKey],
    },
    local2: {
      url: `http://127.0.0.1:8546/`,
      accounts: [process.env.privateKey],
    },
    aurora: {
      url: `https://mainnet.aurora.dev`,
      accounts: [process.env.privateKey],
    },
    fantom: {
      url: `https://rpc.ftm.tools/`,
      accounts: [process.env.privateKey],
      gasPrice: 2118876494
    },
    polygon: {
      url: `https://polygon-rpc.com`,
      accounts: [process.env.privateKey]
    },
    gnc_main: {
      url: `http://mainnet.greenercoin.io:8545`,
      accounts: [process.env.privateKey]
    },
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    compilers: [
      { version: "0.8.28" }
    ]
  },
};
