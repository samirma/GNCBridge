'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { TOKEN_ADDRESS, TOKEN_ABI } from '../constants/token';
import { web3ModalPolygon } from './web3Modals';

let provider = null;
let signer = null;
let tokenContract = null;

function MintToken() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [returnedString, setReturnedString] = useState('');

    async function connectWallet() {
        const web3Provider = await web3ModalPolygon.connect();
        provider = new ethers.providers.Web3Provider(web3Provider);
        const network = await provider.getNetwork();
        if (network.chainId !== 31337) {
            throw new Error('Please connect to the correct network (id: 31337)');
        } else {
            setConnected(true);
        }
        signer = provider.getSigner();
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
    }

    useEffect(() => {
        async function fetchBalance() {
            try {
                await connectWallet();
                const balance = await tokenContract.balanceOf(signer.getAddress());
                setBalance(balance.toString());
                setConnected(true);
            } catch (error) {
                console.error(error);
            }
        }

        fetchBalance();
    }, []);

    async function handleMint() {
        await tokenContract.mint(amount);
        const balance = await tokenContract.balanceOf(signer.getAddress());
        setBalance(balance.toString());
    }

    async function fetchString() {
        setReturnedString(await tokenContract.getMessage());
        await tokenContract.setMessage(amount);
        const returnedString_ = await tokenContract.getMessage();
        setReturnedString(await tokenContract.getMessage());
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
            <h1>Mint Token {returnedString}</h1>
            <p>Balance: {balance}</p>
            <input type="text" placeholder="Amount to mint" onChange={e => setAmount(e.target.value)} />
            <button onClick={handleMint}>Mint</button>
            <button onClick={fetchString}>Fetch String</button>
        </div>
    );
}

export default MintToken;