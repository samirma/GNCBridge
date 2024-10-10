'use client'

import React, { useState, useEffect } from 'react';
import GNCForm from './GNCForm';
import ChainForm from './ChainForm';
import About from './about';
import MintToken from './MintToken';
import { GNC, CHAIN } from 'shared/constants/env';
import { getNetworkConfig } from 'shared/constants/networks';

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
                <li><a className={state === 'home' ? 'active' : ''} onClick={() => setState('home')}> Home</a></li>
                <li><a className={state === 'chain' ? 'active' : ''} onClick={() => setState('chain')}> Chain to GNC: {chain} </a></li>
                <li><a className={state === 'gnc' ? 'active' : ''} onClick={() => setState('gnc')}> GNC to GNC: {gnc} </a></li>
                <li><a className={state === 'MintToken' ? 'active' : ''} onClick={() => setState('MintToken')}> Mint </a></li>
                <li><a className={state === 'about' ? 'active' : ''} onClick={() => setState('about')}> About </a></li>
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
