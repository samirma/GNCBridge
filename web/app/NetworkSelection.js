'use client';
import React, { useState, useEffect } from 'react';
import { getNetworkConfig } from 'shared/constants/networks';
import { GNC, CHAIN } from 'shared/constants/env';

export default function NetworkSelection({ onNetworkSelect }) {
    const [gnc, setGnc] = useState('');
    const [chain, setChain] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        const gncName = getNetworkConfig(GNC).chainName;
        const chainName = getNetworkConfig(CHAIN).chainName;
        setGnc(gncName);
        setChain(chainName);

        const updatedNetworks = [
            { id: GNC, name: gncName, img: 'img/gnc.png' },
            { id: CHAIN, name: chainName, img: 'img/chain-137.png' }
        ];
        setNetworks(updatedNetworks);
        setSelectedOrigin(updatedNetworks[0]);
        setSelectedTarget(updatedNetworks[1]);
    }, []);

    const selectNetworkOrigin = (id) => {
        const selectedNetwork = networks.find(network => network.id === id);
        if (selectedNetwork) {
            setSelectedOrigin(selectedNetwork);
            if (selectedNetwork.id === selectedTarget.id) {
                setSelectedTarget(networks.find(network => network.id !== id));
            }
            onNetworkSelect(selectedNetwork.id);
        }
    };

    const selectNetworkTarget = (id) => {
        const selectedNetwork = networks.find(network => network.id === id);
        if (selectedNetwork) {
            setSelectedTarget(selectedNetwork);
            if (selectedNetwork.id === selectedOrigin.id) {
                setSelectedOrigin(networks.find(network => network.id !== id));
            }
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

    const renderDropdown = (selected, onSelect) => (
        <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                {renderNetworkItem(selected?.name, selected?.img, () => {})}
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
                {renderDropdown(selectedOrigin, selectNetworkOrigin)}
            </div>
            <div className="col-md-2"></div>
            <div className="col-md-5">
                {renderDropdown(selectedTarget, selectNetworkTarget)}
            </div>
        </div>
    );
}
