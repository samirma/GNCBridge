import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerGNCOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        31337: 'http://127.0.0.1:8545/'
      }
    },
  },
};

export const web3ModalGnc = new Web3Modal({
  network: 'GNC',
  cacheProvider: true,
  providerGNCOptions,
});


export const providerPolygonOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        31337: 'http://127.0.0.1:8545/'
      }
    },
  },
};

export const web3ModalPolygon = new Web3Modal({
  network: 'Polygon',
  cacheProvider: true,
  providerPolygonOptions,
});
