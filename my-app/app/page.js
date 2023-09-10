'use client';

import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, CONTRACT_ADDRESS } from "../constants";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";


export default function Page() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [mood, setMood] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  async function connectWallet() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            31337: 'http://127.0.0.1:8545/'
          }
        },
      },
    };
  
    const web3Modal = new Web3Modal({
      network: 'LocalGnc',
      cacheProvider: true,
      providerOptions,
    });

    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const yourContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

    setAccount(accounts[0]);
    setContract(yourContract);
  }

  async function updateMood() {
    await contract.methods.setMood(mood).send({ from: account });
  }

  async function fetchMood() {
    const mood = await contract.methods.getMood().call();
    alert(`Mood is: ${mood}`);
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && contract && (
        <>
          <input type="text" value={mood} onChange={e => setMood(e.target.value)} />
          <button onClick={updateMood}>Update Mood</button>
          <button onClick={fetchMood}>Fetch Mood</button>
        </>
      )}
    </div>
  );
  
}
