// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GncBridge is Ownable {
    
    constructor(address initialOwner) Ownable(initialOwner) {}

    event BalanceAfterTransfer(address indexed _to, uint256 balance);
    event Deposit(address by, uint256 amount);

    // Function to deposit a specified amount of Ether into the contract
    function deposit(uint256 amount) public payable {
        require(msg.value == amount, "Incorrect Ether amount sent");
        require(amount > 0, "You need to send some Ether");

        // Automatically transfer the deposited Ether to the contract owner
        payable(owner()).transfer(amount);

        emit Deposit(msg.sender, amount);
    }

    // Function to transfer Ether to a specified address
    function transferETH(address payable _to, uint256 _amount) public onlyOwner {
        require(address(this).balance >= _amount, "Not enough balance in contract");
        
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed.");
        
        uint256 balanceAfterTransfer = _to.balance;
        emit BalanceAfterTransfer(_to, balanceAfterTransfer);
    }

    // Fallback function to handle any other Ether sent to the contract
    receive() external payable {
        address owner = owner();
        payable(owner).transfer(msg.value);
        emit BalanceAfterTransfer(owner, owner.balance);
    }
}
