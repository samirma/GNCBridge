import { useEffect, useState } from 'react';
import { getNetworkConfig } from 'shared/constants/networks';
import { GNC, CHAIN } from 'shared/constants/env';
import { handleChainChanged, connectToChain, connectToGNC } from './web3';

export default function Network() {
  const [network, setNetwork] = useState('');
  const [gnc, setGnc] = useState('');
  const [chain, setChain] = useState('');

  useEffect(() => {
    setGnc(getNetworkConfig(GNC).chainName);
    setChain(getNetworkConfig(CHAIN).chainName);

    if (window.ethereum) {
      const handleChainChange = handleChainChanged(setNetwork);
      window.ethereum.on('chainChanged', handleChainChange);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChange);
      };
    }
  }, []);

  return (
    <div>
      <h1>Current Network: {network}</h1>
      <button onClick={() => connectToChain()}>
        Switch to chain {chain}
      </button>
      <button onClick={() => connectToGNC()}>
        Switch to gnc {gnc}
      </button>
    </div>
  );
}
