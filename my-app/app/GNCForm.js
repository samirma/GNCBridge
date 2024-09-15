'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, ABI_BRIDGE } from '../constants/chainBridge';
import { web3ModalGnc } from './web3Modals';

let provider = null;
let signer = null;
let chainBridge = null;

const correctNetwork = {
    chainId: '0x7A69', // Hexadecimal for 31337
    chainName: 'Localhost 31337',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: ['http://localhost:8545'],
};

function GNCForm() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function connectWallet() {
        try {
            const web3Provider = await web3ModalGnc.connect();
            provider = new ethers.providers.Web3Provider(web3Provider);
            const network = await provider.getNetwork();
            if (network.chainId !== 31337) {
                await switchNetwork();
            } else {
                setConnected(true);
            }
            signer = provider.getSigner();
            chainBridge = new ethers.Contract(BRIDGE_ADDRESS, ABI_BRIDGE, signer);
        } catch (err) {
            setError(err.message);
        }
    }

    async function switchNetwork() {
        try {
            await provider.send('wallet_addEthereumChain', [correctNetwork]);
            setConnected(true);
        } catch (err) {
            setError('Failed to switch network: ' + err.message);
        }
    }

    useEffect(() => {
        async function fetchBalance() {
            setLoading(true);
            try {
                await connectWallet();
                const balance = await chainBridge.getBalance();
                setBalance(balance.toString());
                setConnected(true);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchBalance();
    }, []);

    async function handleTransfer() {
        setLoading(true);
        try {
            await chainBridge.transferToken(recipient, amount);
            const balance = await chainBridge.getBalance();
            setBalance(balance.toString());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (!connected) {
        return (
            <div>
                <button onClick={connectWallet}>Connect Wallet</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    return (
        <div>
            <h1>Chain Bridge</h1>
            {loading ? <p>Loading...</p> : <p>Balance: {balance}</p>}
            <input type="text" placeholder="Recipient address" onChange={e => setRecipient(e.target.value)} />
            <input type="text" placeholder="Amount to transfer" onChange={e => setAmount(e.target.value)} />
            <button onClick={handleTransfer} disabled={loading}>Transfer</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default GNCForm;
