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
    const [wallet_address, setWalletAddress] = useState(0);
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
            console.log('Error:', errorMessage);
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
            console.log(error.message);
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

            const address = await signer.getAddress();
            setWalletAddress(address);

            const balance = await token.balanceOf(address);
            setBalance(ethers.formatUnits(balance, decimals));

            const contractBalance = await token.balanceOf(CHAIN_BRIDGE_ADDRESS);
            setContractBalance(ethers.formatUnits(contractBalance, decimals));

            const allowance = await token.allowance(address, CHAIN_BRIDGE_ADDRESS);
            if (allowance > 0) {
                setIsApproved(true);
                setTransactionStatus('');
            } else {
                setIsApproved(false);
                setTransactionStatus('Token is not approved');
            }
        } catch (error) {
            console.log(error);
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

    const formatBalance = (balance) => {
        return Intl.NumberFormat("en-US").format(balance);
      };

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
            console.log(error);
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
            const transferTx = await chainBridge.deposit(TOKEN_ADDRESS, amountToTransfer);
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
        return <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>
    }

    if (!connected) {
        return (
            <div>
                <button className="button" onClick={connectWallet}>Connect Wallet</button>
            </div>
        );
    }

    return (
        <div className="form" id="form_chain">
            <p className="user_balance">Balance: <span className="user_balance" >{formatBalance(balance)} GNC</span></p>

            <p className="user_wallet_address">User wallet address: <span className="user_wallet_address" >{wallet_address} </span></p>

            <p className="gnc_token_address">Token Contract Address: <span className="gnc_token_address" >{TOKEN_ADDRESS}</span>  </p>

            <p className="bridge_address">Bridge Contract Address: <span className="bridge_address" >{CHAIN_BRIDGE_ADDRESS} </span></p>

            <div id="dev" className="dev_show">
                <p className="contract_balance">Contract balance: <span className="contract_balance" >{contractBalance} </span></p>
            </div>
            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input type="text" value={amount} placeholder="Amount to transfer" onChange={e => setAmount(e.target.value)} id="amount" />
            </div>
            {!isApproved && <button type="button" className="btn btn-success" onClick={handleApprove}>Approve</button>}
            {isApproved && <button type="button" className="btn btn-success" disabled={!isValidAmount(amount)} onClick={handleTransfer}>Send to GNC</button>}
            <p>{transactionStatus}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default ChainForm;
