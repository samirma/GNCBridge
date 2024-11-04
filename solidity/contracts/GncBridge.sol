// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract GncBridge is Ownable, Pausable {
    
    mapping(bytes32 => bool) public completedTransfers;

    constructor(address initialOwner) Ownable(initialOwner) {}

    event TransferCompleted(address indexed to, bytes32 indexed transferId, uint256 amount);
    event Deposit(address indexed by, uint256 amount, bytes32 indexed transferId);

    function deposit() public payable {
        require(msg.value > 0, "You need to send some Ether");

        bytes32 transferId = keccak256(abi.encodePacked(msg.sender, block.timestamp, msg.value));
        require(!completedTransfers[transferId], "Transfer already completed");

        completedTransfers[transferId] = true;

        payable(owner()).transfer(msg.value);
        emit Deposit(msg.sender, msg.value, transferId);
    }

    function release(address payable _to, uint256 _amount, bytes32 _transferId) public payable onlyOwner {
        require(!completedTransfers[_transferId], "Transfer already completed");

        // Log the current ETH balance
        console.log("Current ETH balance:", address(this).balance);

        completedTransfers[_transferId] = true;

        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit TransferCompleted(_to, _transferId, _amount);
    }

    receive() external payable {
        revert("Use deposit function to send Ether");
    }
}