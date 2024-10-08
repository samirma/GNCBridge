require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });


module.exports = {
  networks: {
    hardhat: {
      chainId: Number(process.env.HARDHAT_CHAIN_ID),
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
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    compilers: [
      { version: "0.8.20" }
    ]
  },
};
