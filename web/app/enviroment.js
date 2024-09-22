import React, { useState, useEffect } from 'react';
import { getNetworkConfig } from 'shared/constants/networks';
import { GNC, CHAIN } from 'shared/constants/env';


export default function Env() {

    const [gnc, setGnc] = useState("");
    const [chain, setChain] = useState("");

    useEffect(() => {
        setGnc(getNetworkConfig(GNC).chainName);
        setChain(getNetworkConfig(CHAIN).chainName);
    }, []);

    return (
      <div>
        <h1>Environment Variables</h1>
        <p>GNC: {gnc}</p>
        <p>CHAIN: {chain}</p>
      </div>
    );
  }
  