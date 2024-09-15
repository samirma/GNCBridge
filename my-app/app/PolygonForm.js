'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ADDRESS, ABI_BRIDGE } from '../constants/chainBridge';
import { TOKEN_ADDRESS, TOKEN_ABI } from '../constants/token';
import { web3ModalPolygon } from './web3Modals';

let provider = null;
let signer = null;
let chainBridge = null;
let token = null;

function PolygonForm() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [contractBalance, setContractBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');
    const [loading, setLoading] = useState(false);

    async function connectWallet() {
        setLoading(true);
        try {
            const web3Provider = await web3ModalPolygon.connect();
            provider = new ethers.providers.Web3Provider(web3Provider);
            const network = await provider.getNetwork();
            if (network.chainId !== 31337) {
                await provider.send('wallet_switchEthereumChain', [{ chainId: '0x7A69' }]); // 31337 in hex
            }
            signer = provider.getSigner();
            chainBridge = new ethers.Contract(BRIDGE_ADDRESS, ABI_BRIDGE, signer);
            token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
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
                const balance = await token.balanceOf(signer.getAddress());
                setBalance(ethers.utils.formatEther(balance));

                const contractBalance = await token.balanceOf(BRIDGE_ADDRESS);
                setContractBalance(ethers.utils.formatEther(contractBalance));

                const allowance = await token.allowance(signer.getAddress(), BRIDGE_ADDRESS);
                if (allowance.gt(0)) {
                    setTransactionStatus('Token is already approved');
                } else {
                    setTransactionStatus('Token is not approved');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchBalance();
    }, []);

    async function handleTransfer() {
        setLoading(true);
        try {
            setTransactionStatus('Initiating transfer...');
            const amountToTransfer = ethers.utils.parseUnits(amount, 'ether'); // Assuming token has 18 decimals
            const allowance = await token.allowance(signer.getAddress(), BRIDGE_ADDRESS);

            if (allowance.lt(amountToTransfer)) {
                setTransactionStatus('Approving token transfer...');
                const maxUint256 = ethers.constants.MaxUint256;
                const approveTx = await token.approve(BRIDGE_ADDRESS, maxUint256);
                await approveTx.wait();
                setTransactionStatus('Approved');
            }

            setTransactionStatus('Transferring tokens...');
            const transferTx = await chainBridge.depositToken(TOKEN_ADDRESS, amountToTransfer);
            await transferTx.wait();

            const balance = await token.balanceOf(signer.getAddress());
            const contractBalance = await token.balanceOf(BRIDGE_ADDRESS);
            setBalance(ethers.utils.formatEther(balance));
            setContractBalance(ethers.utils.formatEther(contractBalance));
            setTransactionStatus('Transfer successful!');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function setMaxAmount() {
        setAmount(balance);
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
            <h1>Chain Bridge</h1>
            <p>Contract balance: {contractBalance}</p>
            <p>Balance: {balance}</p>
            <input type="text" value={amount} placeholder="Amount to transfer" onChange={e => setAmount(e.target.value)} />
            <button className="button" onClick={setMaxAmount}>Set Max</button>
            <button className="button" onClick={handleTransfer}>Send to GNC</button>
            <p>{transactionStatus}</p>
        </div>
    );
}

export default PolygonForm;