// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GncBridge is Ownable {
    
    constructor(address initialOwner) Ownable(initialOwner) {}

    event BalanceBeforeTransfer(address indexed _to, uint256 balance);
    event BalanceAfterTransfer(address indexed _to, uint256 balance);

    function deposit() public payable {
        require(msg.value > 0, "You need to send some Ether");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function transferETH(address payable _to, uint _amount) public onlyOwner {
        require(address(this).balance >= _amount, "Not enough balance in contract");
        
        uint256 balanceBeforeTransfer = _to.balance;
        emit BalanceBeforeTransfer(_to, balanceBeforeTransfer);
        
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed.");
        
        uint256 balanceAfterTransfer = _to.balance;
        emit BalanceAfterTransfer(_to, balanceAfterTransfer);
    }
}
