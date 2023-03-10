import React,{ useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import "../styles/StakingDetails.css";


const StakingDetails = () => {

    
    const [value, setValue] = useState();
    const {account, library} = useWeb3React();
    const NeoABI = useSelector((state) => state.token.NeoTokenAbi);
    const StakingPoolABI = useSelector((state) => state.token.StakingPoolAbi);
    const RewardABI = useSelector((state) => state.token.RewardTokenAbi);
    const StakingPoolContractAddress = useSelector((state) => state.token.StakingPoolAddress);
   
    const handleInputonSubmit = (e) => {     
        setValue(e.target.value);    
      };

    const [balanceNeo, setBalanceNeo] = useState(null);
    const [balanceReward, setBalanceReward] = useState(null);
    const [TotalBalanceStaked, setTotalBalanceStaked] = useState(null);
    const [balanceStaked , setbalanceStaked] = useState(null);
    const [balanceEarned, setBalanceEarned] = useState(null);

    const getBalanceNeo = async () => {
        const balanceofNeo = await NeoABI.methods.balanceOf(account).call({
            from: account,
        });
        setBalanceNeo(library.utils.fromWei(balanceofNeo));
    }

    const getBalanceReward = async () =>{
        const balanceReward = await RewardABI.methods.balanceOf(account).call({
            from: account,
        });
        setBalanceReward(library.utils.fromWei(balanceReward));
    }

    const getTotalAmountStaked = async () => {
        const balanceStaked = await StakingPoolABI.methods.totalSupplyStaked().call()
        setTotalBalanceStaked(library.utils.fromWei(balanceStaked));
    }
        

    let [isApproveStake , setIsApproveStake ]= useState(false);
    
    const approveStakeAmount = async () => {
        const neoTokenApproval = await NeoABI.methods.approve(StakingPoolContractAddress, library.utils.toWei(value,"ether")).send({
            from : account,
        });
        setIsApproveStake(true);
    }
    const stakeToken = async () => {
        const stakeAmount = await StakingPoolABI.methods.stake(library.utils.toWei(value,"ether")).send({
            from: account,
        })
        console.log(stakeAmount)
    }
    
    const unstakeToken = async () => {
        const unstakeAmount = await StakingPoolABI.methods.unstake(library.utils.toWei(value,"ether")).send({
            from : account,
        })
        console.log(unstakeAmount)
    }

    const earnedToken = async () => {
        const earnedAmount = await StakingPoolABI.methods.earned(account).call({
            from:account,
        })
        setBalanceEarned(library.utils.fromWei(earnedAmount));
    }
    
    const getUserBalanceStaked = async () => {
        const stakedBalanced = await StakingPoolABI.methods.balanceOfUserStaked(account).call({
            from : account,
        })
        setbalanceStaked(library.utils.fromWei(stakedBalanced))
    }

    const claimRewardToken = async () => {
        const claimToken = await StakingPoolABI.methods.claimRewards().send({
            from: account,
        })
        console.log(claimToken, "Check here");
    }

    useEffect(() => {
        if (account && NeoABI && RewardABI && StakingPoolABI) {
         getBalanceNeo();
         getBalanceReward();
         getTotalAmountStaked();
         getUserBalanceStaked()
         earnedToken();
        }
      }, [account ,NeoABI, RewardABI, StakingPoolABI]);
    
    return (
    <div>
         <div className="headDetails">Total Supply of Staked : {TotalBalanceStaked}</div>

        <div className="cardContainer">
            <div className="card">
                <div className="card-header">Stake Here !!!</div>
                    <div className="card-body">
                        <div className="textDetails"> User Balance Neo Token : {balanceNeo} </div>
                        <div className="textDetails"> User Balance Reward Token : {balanceReward} </div>

                        <input type="text" name="title" className ="form-control" placeholder="Enter Amount to Stake"
                        onChange={handleInputonSubmit}></input>
                        <button type="button" className="btn btn-primary" onClick={claimRewardToken}> Claim Rewards </button>
                        <button type="button" className="btn btn-primary" onClick={unstakeToken}> Unstake </button>
            
                        <div>{isApproveStake ? (
                        <button type="button" className="btn btn-primary" onClick={stakeToken}> Stake </button>
                        ) : (
                        <button type="button" className="btn btn-primary" onClick={approveStakeAmount}> Approve </button>
                        )}</div>
                        
                        <div className="UserStake">User Staked Amount  : {balanceStaked}</div>
                        <div className="UserEarned">User Earned Reward token : {balanceEarned}</div>
                    </div>
                </div>
            </div>          
        </div>

)   
}

export default StakingDetails;