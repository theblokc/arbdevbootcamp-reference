// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract AddBalance {
    event BalanceAdded(address sender);

    uint256 balance = 0;

    constructor(uint256 initialBalance) {
        balance = initialBalance;
    }

    function addBalance(uint256 toAddBalance) public {
        balance += toAddBalance;
        emit BalanceAdded(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }
}
