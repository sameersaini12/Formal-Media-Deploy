import React , { useState, useEffect } from "react";
import './App.css'
import Sidebar from "./Sidebar";
import Feed from "./Feed"
import Widgets from "./Widgets"
import TwitterIcon from "@material-ui/icons/Twitter";
import {Routes , Route, BrowserRouter} from "react-router-dom";
import Profile from "./Profile";

function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId'})
      // console.log('Connected to chain:' + chainId)

      const rinkebyChainId = '0x4'

      if (chainId !== rinkebyChainId) {
        alert('You are not connected to the Rinkeby Testnet!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      // console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    // console.log('Connected to chain:' + chainId)

    const rinkebyChainId = '0x4'

    if (chainId !== rinkebyChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  });

  return (
    <div>
    {currentAccount === '' ? (
      <div style={{height: "100vh" , backgroundColor : "#0A0B1E" , display : "flex" , justifyContent : "center" , alignItems : "center"}}>
        <div style={{display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : "center"}}>
          <TwitterIcon size={30} style={{color : "white" , marginBottom : "20px" , fontSize : "70px"}}/>
          <button
          className='connectWalletButton text-2xl font-bold  mb-10 hover:scale-105 transition duration-500 ease-in-out'
          style={{backgroundColor : "#50b7f5" , border: "none" , borderRadius : "25px" , padding : "12px 20px" , color : "white" , fontWeight : "500" , fontSize : "20px" , cursor : "pointer" }}
          onClick={connectWallet}
          >
          Connect Wallet
          </button>]
        </div>
      </div>
      ) : correctNetwork ? (
        <div className="app">
          <BrowserRouter>
          <Sidebar currentAccount={currentAccount} />
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/explore" element={<Feed />} />
              <Route path="/bookmarks" element={<Feed />} />
              <Route path="/message" element={<Feed />} />
              <Route path="/notification" element={<Feed />} />
              <Route path="/profile" element={<Profile currentAccount={currentAccount} />} />
            </Routes>
          <Widgets />
          </BrowserRouter>
          
        </div>
      ) : (
      <div 
      className='mb-20 font-bold text-2xl gap-y-3'
      style={{display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : "center"}}
      >
      <div>----------------------------------------</div>
      <div>Please connect to the Rinkeby Testnet</div>
      <div>and reload the page</div>
      <div>----------------------------------------</div>
      </div>
    )}
    </div>
  );
}

export default App;
