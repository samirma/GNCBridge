
import { ethers } from 'ethers';

import { getChainNetwork, getGNCNetwork } from '../constants/networks';


async function switchNetwork(provider, network) {
    await provider.send('wallet_addEthereumChain', [network]);
}

export async function connectToChain(provider) {
    const network = await provider.getNetwork();
    const networkTarget = getChainNetwork()
    if (network.chainId !== networkTarget.chainId) {
        await switchNetwork(provider, networkTarget);
    }
}

export async function connectToGNC(network) {
    const networkTarget = getGNCNetwork()
    if (network.chainId !== networkTarget.chainId) {
        await switchNetwork(networkTarget);
    }
}
