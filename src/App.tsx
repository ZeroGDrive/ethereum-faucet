import detectEthereumProvider from '@metamask/detect-provider';
import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';
import { loadContract } from './utils/load-contract';

function App() {
  const [web3Api, setWeb3Api] = useState<{
    provider: any;
    web3: Web3 | null;
    contract: any;
  }>({
    provider: null,
    web3: null,
    contract: null,
  });

  const [balance, setBalance] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isProviderLoaded, setIsProviderLoaded] = useState(false);

  const canConnectToNetwork = account && web3Api.contract;
  const accountListener = (provider: any) => {
    provider.on('accountsChanged', (accounts: string[]) =>
      setAccount(accounts[0])
    );
    provider.on('chainChanged', (chainId: string) => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider: any = await detectEthereumProvider();
      // with Metamask we have access to window.ethereum & window.web3
      // Metamask injects global api into websites
      if (provider) {
        const contract = await loadContract('Faucet', provider);
        accountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      }
      setIsProviderLoaded(true);
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

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      if (contract && web3) {
        const balance = await web3.eth.getBalance(contract.address);
        setBalance(web3.utils.fromWei(balance, 'ether'));
      }
    };

    web3Api.contract && loadBalance();
  }, [web3Api]);

  const addFunds = useCallback(async () => {
    const { contract } = web3Api;
    if (contract && web3Api.web3) {
      await contract.addFunds({
        from: account,
        value: web3Api.web3.utils.toWei('1', 'ether'),
      });
      setWeb3Api({ ...web3Api, contract });
    }
  }, [account, web3Api]);

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    if (contract && web3) {
      const withdrawAmount = web3.utils.toWei('0.1', 'ether');
      await contract.withdraw(withdrawAmount, { from: account });
      setWeb3Api({ ...web3Api, contract });
    }
  }, [account, web3Api]);

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
              {!isProviderLoaded && 'Looking for a Wallet...'}
              {web3Api.provider ? (
                <strong>Account:</strong>
              ) : (
                isProviderLoaded && (
                  <div className="notification is-warning is-size-6 is-rounded">
                    Wallet is not detected!{'  '}
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://docs.metamask.io"
                    >
                      Install Metamask
                    </a>
                  </div>
                )
              )}
            </span>

            {account ? (
              <span>{account}</span>
            ) : (
              web3Api.provider && <ConnectButton />
            )}
          </div>
          <div className="balance-view is-size-2 mb-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {!canConnectToNetwork && (
            <i className="is-block">Connect to Ganache</i>
          )}

          <button
            disabled={!canConnectToNetwork}
            className="button is-link mr-2"
            onClick={addFunds}
          >
            Donate 1eth
          </button>
          <button
            disabled={!canConnectToNetwork}
            className="button is-primary "
            onClick={withdraw}
          >
            Withdraw 0.1eth
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
