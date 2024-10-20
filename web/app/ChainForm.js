import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE } from 'shared/constants/chainBridge';
import { TOKEN_ADDRESS, TOKEN_ABI } from 'shared/constants/token';
import { connectToChain } from './web3';

let provider;
let signer;
let chainBridge;
let token;

async function initializeEthers() {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    chainBridge = new ethers.Contract(CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE, signer);
    token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
}

function ChainForm() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [contractBalance, setContractBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [decimals, setDecimals] = useState(18); // Default to 18 decimals
    const [isApproved, setIsApproved] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = async () => {
        function onConnected(isConnected) {
            console.log('Connected:', isConnected);
            setConnected(isConnected);
        };

        function onLoading(isLoading) {
            console.log('Loading:', isLoading);
            setLoading(isLoading);
        };

        function onError(errorMessage) {
            console.error('Error:', errorMessage);
            setError(errorMessage);
        };

        await connectToChain(onConnected, onLoading, onError);
    };

    async function connectWallet() {
        setLoading(true);
        setError('');
        try {
            await initializeEthers();
            await handleConnect();
        } catch (error) {
            console.error(error);
            setError("Fail on connectWallet: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchBalance() {
        setLoading(true);
        setError('');
        try {
            const tokenDecimals = await token.decimals();
            setDecimals(tokenDecimals);

            const balance = await token.balanceOf(await signer.getAddress());
            setBalance(ethers.formatUnits(balance, decimals));

            const contractBalance = await token.balanceOf(CHAIN_BRIDGE_ADDRESS);
            setContractBalance(ethers.formatUnits(contractBalance, decimals));

            const allowance = await token.allowance(await signer.getAddress(), CHAIN_BRIDGE_ADDRESS);
            if (allowance > 0) {
                setIsApproved(true);
                setTransactionStatus('');
            } else {
                setIsApproved(false);
                setTransactionStatus('Token is not approved');
            }
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
        } else {
            connectWallet();
        }
    }, [connected]);

    async function handleApprove() {
        setLoading(true);
        setError('');
        try {
            setTransactionStatus('Approving token transfer...');
            const maxUint256 = ethers.MaxUint256;
            const approveTx = await token.approve(CHAIN_BRIDGE_ADDRESS, maxUint256);
            await approveTx.wait();
            setIsApproved(true);
            setTransactionStatus('Approved');
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleTransfer() {
        setLoading(true);
        setError('');
        try {
            setTransactionStatus('Initiating transfer...');
            const amountToTransfer = ethers.parseUnits(amount, decimals);
            const transferTx = await chainBridge.depositToken(TOKEN_ADDRESS, amountToTransfer);
            await transferTx.wait();

            const balance = await token.balanceOf(await signer.getAddress());
            const contractBalance = await token.balanceOf(CHAIN_BRIDGE_ADDRESS);
            setBalance(ethers.formatUnits(balance, decimals));
            setContractBalance(ethers.formatUnits(contractBalance, decimals));
            setTransactionStatus('Transfer successful!');
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
        <>
            <p>Contract balance: {contractBalance}</p>
            <p>Balance: {balance}</p>
            <p>Token Contract Address: {TOKEN_ADDRESS} decimals: {decimals}</p>
            <p>Bridge Contract Address: {CHAIN_BRIDGE_ADDRESS}</p>
            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input type="text" value={amount} placeholder="Amount to transfer" onChange={e => setAmount(e.target.value)} id="amount" />
            </div>
            {!isApproved && <button type="button" className="btn btn-success" onClick={handleApprove}>Approve</button>}
            {isApproved && <button type="button" className="btn btn-success" disabled={!isValidAmount(amount)} onClick={handleTransfer}>Send to GNC</button>}
            <p>{transactionStatus}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
    );
}

export default ChainForm;
