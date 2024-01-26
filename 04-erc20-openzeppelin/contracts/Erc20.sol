// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NameYourToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("NameYourToken", "NYT") {
        _mint(msg.sender, initialSupply);
    }
}
