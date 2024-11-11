// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

abstract contract Bridge is Ownable {

    constructor(address initialOwner) Ownable(initialOwner) {
    }

    struct PendingTransfer {
        address by;
        uint256 amount;
        bytes32 transferId;
    }

    mapping(bytes32 => bool) public completedTransfers;
    
    PendingTransfer[] deposits;

    event TransferCompleted(
        address indexed to,
        uint256 amount, 
        bytes32 indexed transferId
    );

    event Deposit(
        address indexed by,
        uint256 amount,
        bytes32 indexed transferId
    );

    function getDeposits() public view returns (PendingTransfer[] memory) {
        return deposits;
    }

    function removePending(bytes32[] memory transferIds) public onlyOwner {
        for (uint256 i = 0; i < transferIds.length; i++) {
            for (uint256 j = 0; j < deposits.length; j++) {
                if (deposits[j].transferId == transferIds[i]) {
                    deposits[j] = deposits[deposits.length - 1];
                    deposits.pop();
                    break;
                }
            }
        }
    }

    function withdraw(uint256 _amount) public onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(owner()).transfer(_amount);
    }

    function withdrawTokens(address _tokenContract, uint256 _amount) public onlyOwner {
        IERC20 token = IERC20(_tokenContract);
        require(token.balanceOf(address(this)) >= _amount, "Insufficient token balance");
        token.transfer(owner(), _amount);
    }

    modifier notCompleted(bytes32 transferId) {
        require(!completedTransfers[transferId], "Transfer already completed");
        _;
        completedTransfers[transferId] = true;
    }

    function processDeposit(uint256 _amount) internal {
        bytes32 transferId = keccak256(abi.encodePacked(msg.sender, block.timestamp, _amount));
        deposits.push(PendingTransfer(msg.sender, _amount, transferId));
        emit Deposit(msg.sender, msg.value, transferId);
    }

    function processRelease(address _to, uint256 _amount, bytes32 _transferId) internal {
        completedTransfers[_transferId] = true;
        emit TransferCompleted(_to, _amount, _transferId);
    }

}