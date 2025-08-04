import React, { useState } from 'react';
import { ethers } from 'ethers';

const WalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        console.log('Wallet Address:', accounts[0]);
      } catch (error) {
        console.error('Connection Error:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect MetaMask Wallet</button>
      {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
    </div>
  );
};

export default WalletConnect;
