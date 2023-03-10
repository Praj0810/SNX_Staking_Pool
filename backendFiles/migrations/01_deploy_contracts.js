const NeoToken = artifacts.require("NeoToken");
const RewardToken = artifacts.require("RewardToken");
const StakingPool = artifacts.require("StakingPool");

module.exports = async function(deployer, accounts, network){

    await deployer.deploy(NeoToken);
    const neoToken = await NeoToken.deployed();
    await deployer.deploy(RewardToken);
    const rewardToken = await RewardToken.deployed();
    await deployer.deploy(StakingPool , neoToken.address, rewardToken.address);
    const stakingPool = await StakingPool.deployed();
    }



