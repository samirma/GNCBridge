
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
        "blockExplorerUrls": ["https://polygonscan.com"]
    },
    'local2': {
        "chainId": '0x4cd', 
        "chainName": "local2",
        "rpcUrls": ["http://localhost:8546"],
        "nativeCurrency": {
          "name": 'GNC',
          "symbol": 'GNC',
          "decimals": 18
        },
        "blockExplorerUrls": ["https://snowtrace.io"]
    },
    'polygon': {
        "chainId": "0x89",
        "chainName": 'Matic(Polygon) Mainnet',
        "nativeCurrency": { "name": 'POL', "symbol": 'POL', "decimals": 18 },
        "rpcUrls": ['https://polygon.drpc.org'],
        "blockExplorerUrls": ['https://www.polygonscan.com'],
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
    "chainId": '0x4cd', 
    "chainName": "GNC",
    "rpcUrls": ["http://mainnet.greenercoin.io:8545"],
    "nativeCurrency": {
      "name": 'GNC',
      "symbol": 'GNC',
      "decimals": 18
    },
    "blockExplorerUrls": ["https://ftmscan.com"]
  },
  'gnc_test': {
    "chainId": '0x4cd', 
      "chainName": 'Greener Coin Testnet',
      "nativeCurrency": {
          "name": 'GNC',
          "symbol": 'GNC',
          "decimals": 18,
      },
      "rpcUrls": ['http://testnet.greenercoin.io:8545']
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
