import { getChainNetwork, getGNCNetwork } from '../constants/networks';

async function switchNetwork(provider, network) {
    try {
        await provider.send('wallet_addEthereumChain', [network]);
    } catch (error) {
        console.error('Failed to switch network', error);
    }
}

async function connectToNetwork(provider, getNetworkFunction) {
    const network = await provider.getNetwork();
    const networkTarget = getNetworkFunction();
    if (network.chainId !== networkTarget.chainId) {
        await switchNetwork(provider, networkTarget);
    }
}

export async function connectToChain(provider) {
    await connectToNetwork(provider, getChainNetwork);
}

export async function connectToGNC(provider) {
    await connectToNetwork(provider, getGNCNetwork);
}
