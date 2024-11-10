'use client'

import React, { useState, useEffect } from 'react';
import GNCForm from './GNCForm';
import ChainForm from './ChainForm';
import { GNC, CHAIN } from 'shared/constants/env';

export default function App() {
  const [state, setState] = useState(CHAIN);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const handleNetworkSelect = (network) => {
    setState(network);
  }

  const toggleNetwork = () => {
    setState(prevState => (prevState === GNC ? CHAIN : GNC));
  }

  return (
    <div className="row swap_box_border">
      <div className="col-md-12">
        <button onClick={toggleNetwork}>
          {state === GNC ? 'Switch to CHAIN' : 'Switch to GNC'}
        </button>
        <br /><br />
        {state === GNC && <GNCForm />}
        {state === CHAIN && <ChainForm />}
      </div>
    </div>
  )
}
