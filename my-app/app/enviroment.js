import React, { useState, useEffect } from 'react';
import { getChainNetwork, getGNCNetwork } from '../constants/networks';


export default function Env() {

    const [gnc, setConnected] = useState("");
    const [chain, setChain] = useState("");

    useEffect(() => {
        setConnected(getGNCNetwork().chainName);
        setChain(getChainNetwork().chainName);
    }, []);

    return (
      <div>
        <h1>Environment Variables</h1>
        <p>GNC: {gnc}</p>
        <p>CHAIN: {chain}</p>
      </div>
    );
  }
  