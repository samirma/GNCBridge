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
    const [isApproved, setIsApproved] = useState(false);
    const [error, setError] = useState('');

    async function connectWallet() {
        setLoading(true);
        try {
            provider = new ethers.BrowserProvider(window.ethereum)
            const network = await provider.getNetwork();
            await connectToGNC(provider);
            signer = await provider.getSigner();
            chainBridge = new ethers.Contract(BRIDGE_ADDRESS, ABI_BRIDGE, signer);
            setConnected(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchBalance() {
            setLoading(true);
            try {
                await connectWallet();
                const balance = await token.balanceOf(await signer.getAddress());
                setBalance(ethers.formatUnits(balance, decimals));

                const contractBalance = await token.balanceOf(BRIDGE_ADDRESS);
                setContractBalance(ethers.formatUnits(contractBalance, decimals));

                const allowance = await token.allowance(await signer.getAddress(), BRIDGE_ADDRESS);
                if (allowance > 0) {
                    setIsApproved(true);
                    setTransactionStatus('Token is already approved');
                } else {
                    setIsApproved(false);
                    setTransactionStatus('Token is not approved');
                }
            } catch (err) {
                setError('Failed to switch network: ' + err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchBalance();
    }, [decimals]);

    async function handleApprove() {
        setLoading(true);
        try {
            setTransactionStatus('Approving token transfer...');
            const maxUint256 = ethers.MaxUint256;
            const approveTx = await token.approve(BRIDGE_ADDRESS, maxUint256);
            await approveTx.wait();
            setIsApproved(true);
            setTransactionStatus('Approved');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleTransfer() {
        setLoading(true);
        try {
            setTransactionStatus('Initiating transfer...');
            const amountToTransfer = ethers.parseUnits(amount, decimals);
            const transferTx = await chainBridge.depositToken(TOKEN_ADDRESS, amountToTransfer);
            await transferTx.wait();

            const balance = await token.balanceOf(await signer.getAddress());
            const contractBalance = await token.balanceOf(BRIDGE_ADDRESS);
            setBalance(ethers.formatUnits(balance, decimals));
            setContractBalance(ethers.formatUnits(contractBalance, decimals));
            setTransactionStatus('Transfer successful!');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

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
            <input type="text" value={amount} placeholder="Amount to transfer" onChange={e => setAmount(e.target.value)} />
            {!isApproved && <button className="button" onClick={handleApprove}>Approve</button>}
            {isApproved && <button className="button" onClick={handleTransfer}>Send to GNC</button>}
            <p>{transactionStatus}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default GNCForm;
