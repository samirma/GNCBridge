'use client';
import React, { useState, useEffect } from 'react';
import { getNetworkConfig } from 'shared/constants/networks';
import { GNC, CHAIN } from 'shared/constants/env';

export default function NetworkSelection({ onNetworkSelect }) {

    const [gnc, setGnc] = useState('');
    const [chain, setChain] = useState('');

    useEffect(() => {
        setGnc(getNetworkConfig(GNC).chainName);
        setChain(getNetworkConfig(CHAIN).chainName);
      }, []);

    const selectNetWork = (value) => {
        console.error('value:', value);
        onNetworkSelect(value);
    };

    return (
        <div className="row">
        <div className="col-md-5">
            <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                <a className="dropdown-item" href="#">
                <div className="network_img">
                    <img src="img/chain-1.png" alt="Chain 1" />
                </div>
                <span>{chain}</span>
                </a>
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" href="#" onClick={() => selectNetWork(GNC)}>
                <div className="network_img">
                    <img src="img/chain-1.png" alt="Chain 1" />
                </div>
                <span>{chain}</span>
                </a>
                <a className="dropdown-item" href="#" onClick={() => selectNetWork(CHAIN)}>
                <div className="network_img">
                    <img src="img/chain-137.png" alt="Chain 137" />
                </div>
                <span>{gnc}</span>
                </a>
            </div>
            </div>
        </div>
        <div className="col-md-2"></div>
        <div className="col-md-5">
            <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                <a className="dropdown-item" href="#">
                <div className="network_img">
                    <img src="img/chain-1.png" alt="Chain 1" />
                </div>
                <span>{gnc}</span>
                </a>
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" href="#" onClick={() => selectNetWork(GNC)}>
                <div className="network_img">
                    <img src="img/chain-1.png" alt="Chain 1" />
                </div>
                <span>{chain}</span>
                </a>
                <a className="dropdown-item" href="#" onClick={() => selectNetWork(CHAIN)}>
                <div className="network_img">
                    <img src="img/chain-137.png" alt="Chain 137" />
                </div>
                <span>{gnc}</span>
                </a>
            </div>
            </div>
        </div>
        </div>
    );
}
