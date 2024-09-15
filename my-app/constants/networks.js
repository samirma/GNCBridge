const networks = {
  'local': {
      chainId: '0x7A69', // Hexadecimal for 31337
      chainName: 'Localhost 31337',
      nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
      },
      rpcUrls: ['http://localhost:8545'],
      blockExplorerUrls: ['http://localhost:8545'],
  },
  'polygon': {
      chainId: "0x89",
      chainName: "Polygon",
      nativeCurrency: {
          name: "Matic",
          symbol: "MATIC",
          decimals: 18
      },
      rpcUrls: [
          "https://polygon-mainnet.infura.io/v3/42562fc1754d4557a37d54da6d89a313"
      ],
      blockExplorerUrls: [
          "https://polygonscan.com/"
      ]
  },
  'gnc_main': {
      chainId: '0x7A69', 
      chainName: 'Greener Coin Mainnet',
      nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
      },
      rpcUrls: ['http://35.208.144.105:8545'],
      blockExplorerUrls: ['http://localhost:8545'],
  },
  'fantom': {
      chainId: '0xFA',
      blockExplorerUrls: ['https://ftmscan.com'],
      chainName: 'Fantom Opera',
      rpcUrls: ['https://rpc.ftm.tools'],
      nativeCurrency: {
          name: 'Fantom',
          symbol: 'FTM',
          decimals: 18
      }
  }
};

function getNetworkConfig(networkName) {
  return networks[networkName];
};

export function getChainNetwork() {
  return {
    chainId: '0x7A69', // Hexadecimal for 31337
    chainName: 'Localhost 31337',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: ['http://localhost:8545'],
};
};

export function getGNCNetwork() {
    return {
        chainId: '0x7A69', // Hexadecimal for 31337
        chainName: 'Localhost 31337',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['http://localhost:8545'],
        blockExplorerUrls: ['http://localhost:8545'],
    };
};

