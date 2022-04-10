import React, { useState, useEffect } from "react";
import CommunityPolls from "./contracts/CommunityPolls.json";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";


import "./App.css";
import Feed from "./components/Feed/Feed";

const App = () => {
  const [web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState({});

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

        // Set web3, accounts, and contract to the state, and then proceed with an
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);
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
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <h1>{accounts[0]}</h1>
        <Feed/>
    </div>
    );
}

export default App;
