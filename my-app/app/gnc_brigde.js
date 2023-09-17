import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'INFURA_PROJECT_ID', // Required
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions,
});

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect();
    }
  }, []);

  const onConnect = async () => {
    const provider = await web3Modal.connect();
    await setupContract(provider);
  };

  const setupContract = async (provider) => {
    const contractAddress = 'CONTRACT_ADDRESS'; // Replace with your contract address
    const abi = []; // Replace with your contract ABI

    const signer = new ethers.providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    setProvider(provider);
    setContract(contract);
  };

  const onDeposit = async () => {
    if (!contract) return;

    const tx = await contract.deposit({ value: ethers.utils.parseEther('1') });
    await tx.wait();
  };

  return (
    <div>
      <button onClick={onConnect}>Connect Wallet</button>
      <button onClick={onDeposit}>Deposit 1 ETH</button>
    </div>
  );
}
