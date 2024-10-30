'use client'

import React, { useState, useEffect } from 'react';
import GNCForm from './GNCForm';
import ChainForm from './ChainForm';
import About from './about';
import MintToken from './MintToken';
import NetworkSelection from './NetworkSelection'
import { GNC, CHAIN } from 'shared/constants/env';
import { getNetworkConfig } from 'shared/constants/networks';

export default function App() {
  const [state, setState] = useState("");

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    handleNetworkSelect(GNC);
  }, []);

  const handleNetworkSelect = (network) => {
    setState(network);
  }

  return (
    <div className="row swap_box_border">
      <div className="col-md-12">
      <br /><br />
      {/* <NetworkSelection onNetworkSelect={handleNetworkSelect} /> */}
        <br /><br />
        {state === GNC && <GNCForm />}
        {state === CHAIN && <ChainForm />}
      </div>
    </div>
  )
}
