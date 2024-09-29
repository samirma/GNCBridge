
const networks = {
    'local1': {
        "chainId": "0xfa",
        "chainName": "local1",
        "rpcUrls": ["http://localhost:8545"],
        "nativeCurrency": {
          "name": "Fantom",
          "symbol": "FTM",
          "decimals": 18
        },
        "blockExplorerUrls": ["https://ftmscan.com"]
    },
    'local2': {
        "chainId": "0xa86a",
        "chainName": "local2",
        "rpcUrls": ["http://localhost:8546"],
        "nativeCurrency": {
        "name": "Avalanche",
        "symbol": "AVAX",
        "decimals": 18
        },
        "blockExplorerUrls": ["https://snowtrace.io"]
    },
    'polygon': {
        "chainId": "0x89",
        "chainName": "Polygon",
        "rpcUrls": ["https://rpc-mainnet.maticvigil.com/"],
        "nativeCurrency": {
          "name": "Matic",
          "symbol": "MATIC",
          "decimals": 18
        },
        "blockExplorerUrls": ["https://polygonscan.com"]
      },

    'avalanche': {
        "chainId": "0xa86a",
        "chainName": "Avalanche",
        "rpcUrls": ["https://api.avax.network/ext/bc/C/rpc"],
        "nativeCurrency": {
        "name": "Avalanche",
        "symbol": "AVAX",
        "decimals": 18
        },
        "blockExplorerUrls": ["https://snowtrace.io"]
  },
  'gnc_main': {
      chainId: '0x7A69', 
      chainName: 'Greener Coin Mainnet',
      nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
      },
      rpcUrls: ['http://35.208.144.105:8545']
  },
  'fantom': {
    "chainId": "0xfa",
    "chainName": "Fantom",
    "rpcUrls": ["https://rpcapi.fantom.network"],
    "nativeCurrency": {
      "name": "Fantom",
      "symbol": "FTM",
      "decimals": 18
    },
    "blockExplorerUrls": ["https://ftmscan.com"]
  }
};

export function getNetworkConfig(networkName) {
  return networks[networkName];
};
