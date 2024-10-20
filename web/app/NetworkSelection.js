'use client';
import React, { useState, useEffect } from 'react';
import { getNetworkConfig } from 'shared/constants/networks';
import { GNC, CHAIN } from 'shared/constants/env';

export default function NetworkSelection({ onNetworkSelect }) {
    const [gnc, setGnc] = useState('');
    const [chain, setChain] = useState('');
    const networks = [
        { id: GNC, name: gnc, img: 'img/chain-1.png' },
        { id: CHAIN, name: chain, img: 'img/chain-137.png' }
    ];
    const [selectedOrigin, setSelectedOrigin] = useState(networks[0]);
    const [selectedTarget, setSelectedTarget] = useState(networks[1]);

    useEffect(() => {
        setGnc(getNetworkConfig(GNC).chainName);
        setChain(getNetworkConfig(CHAIN).chainName);
    }, []);

    const selectNetworkOrigin = (id) => {
        const selectedNetwork = networks.find(network => network.id === id);
        if (selectedNetwork) {
            setSelectedOrigin(selectedNetwork);
            onNetworkSelect(selectedNetwork);
        }
    };

    const selectNetworkTarget = (id) => {
        const selectedNetwork = networks.find(network => network.id === id);
        if (selectedNetwork) {
            setSelectedTarget(selectedNetwork);
            onNetworkSelect(selectedNetwork);
        }
    };

    const renderNetworkItem = (name, img, action) => (
        <a className="dropdown-item" href="#" onClick={action}>
            <div className="network_img">
                <img src={img} alt={name} />
            </div>
            <span>{name}</span>
        </a>
    );

    const renderDropdown = (selected, onSelect, label) => (
        <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                {renderNetworkItem(selected.name, selected.img, null)}
                <span>{selected.name}</span>
            </button>
            <div className="dropdown-menu">
                {networks.map(network =>
                    renderNetworkItem(network.name, network.img, () => onSelect(network.id))
                )}
            </div>
        </div>
    );

    return (
        <div className="row">
            <div className="col-md-5">
                {renderDropdown(selectedOrigin, selectNetworkOrigin, 'Origin')}
            </div>
            <div className="col-md-2"></div>
            <div className="col-md-5">
                {renderDropdown(selectedTarget, selectNetworkTarget, 'Target')}
            </div>
        </div>
    );
}
