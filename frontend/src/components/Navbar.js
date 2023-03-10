import React from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./Connector.js";
import { useEffect } from "react";
import NeoTokenAbi from "../contracts/NeoToken.json";
import RewardTokenAbi from "../contracts/RewardToken.json";
import StakingPoolAbi from "../contracts/StakingPool.json";
import { useDispatch } from "react-redux";
import { updateAbi } from "../reducers/stateReducer";


const Navbar = () => {
  const dispatch = useDispatch();

  const { active, account, library, activate, deactivate } =
    useWeb3React();

  // async function balanceFetch() {
  //   try {
  //     if (active) {
  //       console.log(library);
  //       const balance = await library.eth.getBalance(account);
  //       console.log(balance);
  //       const balanceToken = await library.utils.fromWei(balance);
  //       console.log(balanceToken);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function connect() {
    try {
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", false);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", true);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, [activate]);



  const ConnectInstance = async () => {
    console.log(library);
    const networkID = await library.eth.net.getId();
    console.log(networkID, "get Network ID here");
    const networkNeoToken = NeoTokenAbi.networks[networkID];
    console.log(networkNeoToken);
    const NeoTokenInstance = await new library.eth.Contract(NeoTokenAbi.abi, networkNeoToken.address);
    console.log(NeoTokenInstance);
    
    
    const networkDataReward = RewardTokenAbi.networks[networkID];
    console.log(networkDataReward);
    const RewardInstance = await new library.eth.Contract(RewardTokenAbi.abi, networkDataReward.address);
    console.log(RewardInstance);
    // const balanceOfEGold = await EGoldInstance.methods.balanceOf(account).call();
    // const formatBalEGold = library.utils.fromWei(balanceOfEGold);
    // console.log(formatBalEGold, "eGold Balance");
    
    //Staking Pool Instance 
    const networkStakingPool = StakingPoolAbi.networks[networkID];
    console.log(networkStakingPool);
    const StakingPoolInstance = await new library.eth.Contract(StakingPoolAbi.abi, networkStakingPool.address);
    console.log(StakingPoolInstance, "here");
   
   
    dispatch(updateAbi({
      NeoTokenAbi:NeoTokenInstance,
      RewardTokenAbi:RewardInstance,
      StakingPoolAbi: StakingPoolInstance, 
      NeoTokenAddress: networkNeoToken.address,
      RewardTokenAddress: networkDataReward.address,
      StakingPoolAddress: networkStakingPool.address,  
    }))  
  };
  
  useEffect(() => {
    if (active) {
      ConnectInstance();
    }
  },[active]);


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" href=" # " >
            Staking App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                {/* <a className="nav-link active" aria-current="page" href=" # ">
                  Home
                </a> */}
              </li>
            </ul>
            <button
              type="button"
              className="btn btn-primary"
              onClick={connect}
            >
              Connect MetaMask
            </button>
            {active ? (
              <span>
              <b>{account}</b>
              </span>
            ) : (
              <span>Not connected</span>
            )}
             <button
              type="button"
              className="btn btn-primary"
              onClick={disconnect}
            >
            Disconnect
            </button>  
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;