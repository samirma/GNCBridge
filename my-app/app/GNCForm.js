'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, ABI_BRIDGE } from '../constants/chainBridge';

let provider = null;
let signer = null;
let chainBridge = null;

function GNCForm() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function connectWallet() {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            if (network.chainId !== 31337) {
                await switchNetwork();
            } else {
                setConnected(true);
            }
            signer = await provider.getSigner();
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
