import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE } from 'shared/constants/gncBridge';
import { connectToGNC } from './web3';

let provider;
let signer;
let chainBridge;

async function initializeEthers() {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    chainBridge = new ethers.Contract(GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE, signer);
}

function GNCForm() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [contractBalance, setContractBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [decimals, setDecimals] = useState(18); // Default to 18 decimals
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
            console.log('Error:', errorMessage);
            setError(errorMessage);
        };

        await connectToGNC(onConnected, onLoading, onError);
    };

    async function connectWallet() {
        setLoading(true);
        try {
            await initializeEthers();
            await handleConnect();
        } catch (error) {
            console.log(error);
            setError("Fail on connectWallet: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchBalance() {
        setLoading(true);
        try {
            const userAddress = await signer.getAddress();
            const userBalance = await provider.getBalance(userAddress);
            const contractBal = await provider.getBalance(GNC_BRIDGE_ADDRESS);
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
        } else {
            connectWallet();
        }
    }, [connected]);

    async function handleDeposit() {
        setLoading(true);
        setError('');
        try {
            setTransactionStatus('Initiating deposit...');
            const amountToDeposit = ethers.parseUnits(amount, decimals);
            const depositTx = await chainBridge.deposit(amountToDeposit, { value: amountToDeposit });
            await depositTx.wait();

            fetchBalance(); // Refresh balance after deposit
            setTransactionStatus('Deposit successful!');
            setAmount(''); // Clear the input field
        } catch (error) {
            console.log(error);
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
        return <div>Loading... {error && <p style={{ color: 'red' }}>{error}</p>}</div>;
    }

    if (!connected) {
        return (
            <div>
                <button className="button" onClick={connectWallet}>Connect Wallet</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    return (
        <div className="form" id="form_gnc">
            <p>Contract balance: {contractBalance}</p>
            <p>Balance: {balance}</p>
            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input type="text" value={amount} placeholder="Amount to deposit" onChange={e => setAmount(e.target.value)} id="amount" />
            </div>
            <button type="button" className="btn btn-success" disabled={!isValidAmount(amount)} onClick={handleDeposit}>Deposit Ether</button>
            <p>{transactionStatus}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default GNCForm;
