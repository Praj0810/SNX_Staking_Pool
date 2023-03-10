//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NeoToken is ERC20 {
    constructor() ERC20("Neo Token", "NT") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}