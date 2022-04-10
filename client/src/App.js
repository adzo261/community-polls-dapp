import React, { useState, useEffect, Fragment } from "react";
import CommunityPolls from "./contracts/CommunityPolls.json";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import CircularProgress from '@mui/material/CircularProgress';

import "./App.css";
import CreatePoll from "./components/CreatePoll/CreatePoll";
import PollFeed from "./components/PollFeed/PollFeed";
import ChainAccess from "./api/chain-access";

const App = () => {
  const [web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => connectToMetaMask(), []); 


  const connectToMetaMask = async () => {

    const provider = await detectEthereumProvider();

    if (provider) {
      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
      }
      // Access the decentralized web!
      try {
        //Request to select account from MetaMask
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        //create web3 instance
        const web3 = new Web3(provider);

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = CommunityPolls.networks[networkId];
        const instance = new web3.eth.Contract(
          CommunityPolls.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state
        setWeb3(web3);
        window.ethereum.on('accountsChanged', function (accounts) {
          setAccounts(accounts);
          ChainAccess.setChainAddressState(accounts[0]);
        });
        setAccounts(accounts);
        setContract(instance);
        ChainAccess.setChainState(web3, accounts[0], instance);

        //We are now connected to metamask
        setIsConnected(true);
      } catch(error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {
          isConnected ? (
            <Fragment>
              <CreatePoll></CreatePoll>
              <PollFeed/>
            </Fragment>
          ) : (
            <div>
              <h1 style={{"color": "white"}}>Connecting to MetaMask...</h1>
              <CircularProgress color="secondary" />
            </div>
          )
        }
    </div>
    );
}

export default App;
