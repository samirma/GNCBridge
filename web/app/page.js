'use client'

import React, { useState, useEffect } from 'react';
import GNCForm from './GNCForm';
import ChainForm from './ChainForm';
import About from './about';
import MintToken from './MintToken';
import Network from './network';
import { GNC, CHAIN } from 'shared/constants/env';
import { getNetworkConfig } from 'shared/constants/networks';
import { handleChainChanged, connectToChain, connectToGNC } from './web3';

export default function App() {
  const [state, setState] = useState("chain");
  const [gnc, setGnc] = useState('');
  const [chain, setChain] = useState('');

  useEffect(() => {
    setGnc(getNetworkConfig(GNC).chainName);
    setChain(getNetworkConfig(CHAIN).chainName);
  }, []);

  return (
    <div>
        <nav>
            <ul>
                <li><a onClick={() => setState('home')}> Home</a></li>
                <li><a onClick={() => setState('chain')}> Chain to GNC: {chain} </a></li>
                <li><a onClick={() => setState('gnc')}> GNC to GNC: {gnc} </a></li>
                <li><a onClick={() => setState('MintToken')}> Mint </a></li>
                <li><a onClick={() => setState('about')}> About </a></li>
            </ul>
        </nav>

        <p>Current state: {state}</p>

        {/* <Network/> */}

        {state === 'about' && <About />}
        {state === 'gnc' && <GNCForm />}
        {state === 'chain' && <ChainForm />}
        {state === 'MintToken' && <MintToken />}

    </div>
  );
}
