// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 public tokenPrice;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function buy(uint256 amount) public payable {
        require(tokenPrice * amount == msg.value, "Not enough credit");
        bool sent = payable(super.owner()).send(tokenPrice * amount);
        require(sent, "Didn't receive fee.");
        _mint(msg.sender, amount * 10 ** decimals());
    }

    function setPrice(uint256 price) public onlyOwner {
        tokenPrice = price;
    }
}
