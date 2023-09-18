import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        31337: 'http://127.0.0.1:8545/'
      }
    },
  },
};

export const web3Modal = new Web3Modal({
  network: 'LocalGnc',
  cacheProvider: true,
  providerOptions,
});
