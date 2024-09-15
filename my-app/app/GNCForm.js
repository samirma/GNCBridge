'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, ABI_BRIDGE } from '../constants/gncBridge';
import { connectToGNC } from './web3';

let provider = null;
let signer = null;
let chainBridge = null;

function GNCForm() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [contractBalance, setContractBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [decimals, setDecimals] = useState(18); // Default to 18 decimals
    const [error, setError] = useState('');

    async function connectWallet() {
        setLoading(true);
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            await connectToGNC(provider);
            signer = await provider.getSigner();
            chainBridge = new ethers.Contract(BRIDGE_ADDRESS, ABI_BRIDGE, signer);
            setConnected(true);
        } catch (error) {
            console.error(error);
            setError("Fail on connectWallet" + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchBalance() {
        setLoading(true);
        try {
            const userAddress = await signer.getAddress();
            const userBalance = await provider.getBalance(userAddress);
            const contractBal = await provider.getBalance(BRIDGE_ADDRESS);
            setBalance(ethers.formatUnits(userBalance, decimals));
            setContractBalance(ethers.formatUnits(contractBal, decimals));
        } catch (error) {
            console.error(error);
            setError("Fail on fetchBalance: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (connected) {
            fetchBalance();
        }
    }, [connected]);

    async function handleDeposit() {
        setLoading(true);
        setError('');
        try {
            await connectWallet();
            setTransactionStatus('Initiating deposit...');
            const amountToDeposit = ethers.parseUnits(amount, decimals);
            const depositTx = await chainBridge.deposit(amountToDeposit, { value: amountToDeposit });
            await depositTx.wait();

            fetchBalance(); // Refresh balance after deposit
            setTransactionStatus('Deposit successful!');
            setAmount(''); // Clear the input field
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const isValidAmount = (value) => {
        // Add your validation logic here (e.g., check if the value is a positive number)
        return !isNaN(value) && Number(value) > 0;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!connected) {
        return (
            <div>
                <button className="button" onClick={connectWallet}>Connect Wallet</button>
            </div>
        );
    }

    return (
        <div>
            <h1>GNC Bridge</h1>
            <p>Contract balance: {contractBalance}</p>
            <p>Balance: {balance}</p>
            <input type="text" value={amount} placeholder="Amount to deposit" onChange={e => setAmount(e.target.value)} />
            <button className="button" disabled={!isValidAmount(amount)} onClick={handleDeposit}>Deposit Ether</button>
            <p>{transactionStatus}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default GNCForm;
