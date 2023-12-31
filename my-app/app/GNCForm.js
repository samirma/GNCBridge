'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, ABI_BRIDGE } from '../constants/chainBridge';
import { web3ModalGnc } from './web3Modals';

let provider = null;
let signer = null;
let chainBridge = null;



function GNCForm() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    async function connectWallet() {
        const web3Provider = await web3ModalGnc.connect();
        provider = new ethers.providers.Web3Provider(web3Provider);
        const network = await provider.getNetwork();
        if (network.chainId !== 31337) {
            throw new Error('Please connect to the correct network (id: 31337)');
        } else {
            setConnected(true);
        }
        signer = provider.getSigner();
        chainBridge = new ethers.Contract(BRIDGE_ADDRESS, ABI_BRIDGE, signer);
    }

    useEffect(() => {
        async function fetchBalance() {
            try {
                await connectWallet();
                const balance = await chainBridge.getBalance();
                setBalance(balance.toString());
                setConnected(true);
            } catch (error) {
                console.error(error);
            }
        }

        fetchBalance();
    }, []);

    async function handleTransfer() {
        await chainBridge.transferToken(recipient, amount);
        const balance = await chainBridge.getBalance();
        setBalance(balance.toString());
    }

    if (!connected) {
        return (
            <div>
                <button onClick={connectWallet}>Connect Wallet</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Chain Bridge</h1>
            <p>Balance: {balance}</p>
            <input type="text" placeholder="Recipient address" onChange={e => setRecipient(e.target.value)} />
            <input type="text" placeholder="Amount to transfer" onChange={e => setAmount(e.target.value)} />
            <button onClick={handleTransfer}>Transfer</button>
        </div>
    );
}

export default GNCForm;
