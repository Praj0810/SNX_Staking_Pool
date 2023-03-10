//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("Reward Token", "RT") {
    }

    function mint(address account) external {
        _mint(account, 100000 * 10 ** 18);
    }
}