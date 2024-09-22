import { getNetworkConfig } from 'shared/constants/networks';
import { GNC, CHAIN } from 'shared/constants/env';

async function connectToNetwork(provider, getNetworkFunction) {
    const network = await provider.getNetwork();
    const networkTarget = getNetworkFunction();
    console.log(`Current Network: ID = ${network.chainId}, Name = ${network.name}`);
    console.log(`Intended Network: ID = ${networkTarget.chainId}, Name = ${networkTarget.chainName}`);
    if (network.chainId !== networkTarget.chainId) {
        await provider.send('wallet_addEthereumChain', [networkTarget]);
    }
}

export async function connectToChain(provider) {
    await connectToNetwork(provider, () => getNetworkConfig(CHAIN));
}

export async function connectToGNC(provider) {
    await connectToNetwork(provider, () => getNetworkConfig(GNC));
}
