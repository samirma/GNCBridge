import { ethers } from 'ethers';
import { getNetworkConfig } from 'shared/constants/networks';
import { GNC, CHAIN } from 'shared/constants/env';

export const handleChainChanged = (setNetwork) => (chainId) => {
  setNetwork(chainId);
  console.log('Network switched to:', chainId);
};

export const switchNetwork = async (networkConfig) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    });
  } catch (error) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      } catch (addError) {
        console.error('Failed to add network', addError);
      }
    } else {
      console.error('Failed to switch network', error);
    }
  }
};

export const connectToNetwork = async (networkConfig) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  console.log(`Current Network: ID = ${network.chainId}, Name = ${network.name}`);
  console.log(`Intended Network: ID = ${networkConfig.chainId}, Name = ${networkConfig.chainName}`);
  if (network.chainId !== networkConfig.chainId) {
    await switchNetwork(networkConfig);
  }
};

export async function connectToChain() {
  await connectToNetwork(getNetworkConfig(CHAIN));
}

export async function connectToGNC() {
  await connectToNetwork(getNetworkConfig(GNC));
}
