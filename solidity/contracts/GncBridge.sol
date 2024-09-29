// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GncBridge is Ownable {
    
    constructor(address initialOwner) Ownable(initialOwner) {}

    event BalanceBeforeTransfer(address indexed _to, uint256 balance);
    event BalanceAfterTransfer(address indexed _to, uint256 balance);
    event Deposit(address by, uint256 amount);

    // Function to deposit a specified amount of Ether into the contract
    function deposit(uint256 amount) public payable {
        require(msg.value == amount, "Incorrect Ether amount sent");
        require(amount > 0, "You need to send some Ether");

        // Automatically transfer the deposited Ether to the contract owner
        transferETH(payable(owner()), amount);

        emit Deposit(msg.sender, amount);
    }

    // Function to get the contract's balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to transfer Ether to a specified address
    function transferETH(address payable _to, uint256 _amount) public onlyOwner {
        require(address(this).balance >= _amount, "Not enough balance in contract");
        
        uint256 balanceBeforeTransfer = _to.balance;
        emit BalanceBeforeTransfer(_to, balanceBeforeTransfer);
        
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed.");
        
        uint256 balanceAfterTransfer = _to.balance;
        emit BalanceAfterTransfer(_to, balanceAfterTransfer);
    }
}
