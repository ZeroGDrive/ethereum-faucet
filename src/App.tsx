import detectEthereumProvider from '@metamask/detect-provider';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';

function App() {
  const [web3Api, setWeb3Api] = useState<{ provider: any; web3: Web3 | null }>({
    provider: null,
    web3: null,
  });

  const [account, setAccount] = useState<string | null>(null);
  useEffect(() => {
    const loadProvider = async () => {
      const provider: any = await detectEthereumProvider();
      // with Metamask we have access to window.ethereum & window.web3
      // Metamask injects global api into websites
      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
        });
      } else {
        alert('Please install Metamask');
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      if (web3Api.web3) {
        const accounts = await web3Api.web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    };
    getAccounts();
  }, [web3Api.web3]);

  const ConnectButton = () => {
    return (
      <button
        className="button is-warning is-light my-2 is-small"
        onClick={() => {
          web3Api.provider.request({ method: 'eth_requestAccounts' });
        }}
      >
        Connect Metamask
      </button>
    );
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span className="mr-2">
              <strong>Account:</strong>
            </span>

            {account ? <span>{account}</span> : <ConnectButton />}
          </div>
          <div className="balance-view is-size-2 mb-4">
            Current Balance: <strong>10</strong>ETH
          </div>

          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary ">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
