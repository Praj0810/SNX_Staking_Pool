//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "./NeoToken.sol";
import "./RewardToken.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StakingPool is ReentrancyGuard{

    //Staking Token 
    NeoToken public neoToken;
    // reward token to be given to user after staking
    RewardToken public rewardToken;
    // reward token per second 
    uint256 public constant RewardRate = 100;
    uint256 public lastTimeUpdate;
    //100 per second
    uint256 public rewardPerTokenStored; 

    // uint256 public finishAt;
    // uint256 public rewardsDuration;
    

    //mapping of how much user staked in StakingPool
    mapping (address => uint256) public userStakingBalance;
    //mapping of how much each user earned rewards per sec after staking
    mapping (address => uint256) public rewardsEarned;
    //mapping how much each user has been paid with reward Token
    mapping (address => uint256) public userRewardPerTokenPaid;


    uint256  public stotalSupply ; 

    event Staked(address indexed user, uint256 indexed amount);
    event WithdrewStake(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);

     modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerStakedToken();
        lastTimeUpdate = block.timestamp;
        rewardsEarned[account] = earned(account);
        userRewardPerTokenPaid[msg.sender] = rewardPerTokenStored;
        _;
     }

    // modifier onlyOwner(){
    //     require(msg.sender  == owner ,"Not owner");
    //     _;
    // }

    constructor(address _neoToken, address _rewardToken ){
        neoToken = NeoToken(_neoToken);
        rewardToken = RewardToken(_rewardToken);
    }
    
    // function setRewardsDuration(uint _duration) external onlyOwner {
    //     require(finishAt < block.timestamp, "reward duration not finished");
    //     rewardsDuration = _duration;
    // }

    function rewardPerStakedToken() public view returns(uint256){
        if(stotalSupply == 0 ){
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + (RewardRate *(block.timestamp - lastTimeUpdate)  * 1e18/ stotalSupply);
    }

    function earned(address account) public view returns(uint256){
        uint256 currentUserBalance = userStakingBalance[account];
        uint256 amountPaid = userRewardPerTokenPaid[account];
        uint256 currentrewardPerToken = rewardPerStakedToken();
        uint256 pastRewards = rewardsEarned[account]; 
        uint256 earn = ((currentUserBalance * (currentrewardPerToken - amountPaid)/1e18)+ pastRewards);
        return earn;
    }

    function stake(uint256 amount)external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Amount is 0 cannot stake 0");
        stotalSupply = stotalSupply + amount;
        userStakingBalance[msg.sender] += amount;
        neoToken.transferFrom(msg.sender, address(this), amount);
        rewardToken.mint(address(this));
        //event Emitted
        emit Staked(msg.sender, amount);      
    }

    function unstake(uint256 amount)external nonReentrant updateReward(msg.sender){
        require(amount > 0 , "Cannot withdraw Zero");
        stotalSupply -= amount;
        userStakingBalance[msg.sender] -= amount;
        neoToken.transfer(msg.sender, amount);
        //event Emitted
        emit WithdrewStake(msg.sender , amount);
    }

    function claimRewards() external nonReentrant updateReward(msg.sender){
        uint256 reward = rewardsEarned[msg.sender];
        //rewardsEarned[msg.sender] = 0;
        rewardToken.transfer(msg.sender , reward);
        emit RewardsClaimed(msg.sender, reward);
    }

    function totalSupplyStaked() external view returns (uint256) {
        return stotalSupply;
    }

    function balanceOfUserStaked(address account) external view returns (uint256) {
        return userStakingBalance[account];
    }
}