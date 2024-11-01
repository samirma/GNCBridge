import { ethers } from 'ethers';
import { getNetworkConfig } from 'shared/networks';
import { GNC, CHAIN } from 'shared/constants/env';

export const handleChainChanged = (setNetwork) => (chainId) => {
  setNetwork(chainId);
  console.log('Network switched to:', chainId);
};

const switchNetwork = async (networkConfig) => {
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
        throw new Error('Failed to add network');
      }
    } else {
      throw new Error('Failed to switch network');
    }
  }
};

const connectToNetwork = async (networkConfig, onConnected, onLoading, onError) => {
  onLoading(true);
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    console.log(`Current Network: ID = ${network.chainId}, Name = ${network.name}`);
    console.log(`Intended Network: ID = ${networkConfig.chainId}, Name = ${networkConfig.chainName}`);
    if (network.chainId !== networkConfig.chainId) {
      await switchNetwork(networkConfig);
    }
    onConnected(true);
    onError('');
  } catch (error) {
    onError(error.message);
    onConnected(false);
  } finally {
    onLoading(false);
  }
};

export async function connectToChain(onConnected, onLoading, onError) {
  await connectToNetwork(getNetworkConfig(CHAIN), onConnected, onLoading, onError);
}

export async function connectToGNC(onConnected, onLoading, onError) {
  await connectToNetwork(getNetworkConfig(GNC), onConnected, onLoading, onError);
}
