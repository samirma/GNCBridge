// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ChainBridge is Ownable, Pausable {
    
    mapping(bytes32 => bool) public completedTransfers;

    constructor(address initialOwner) Ownable(initialOwner) {}

    event TransferCompleted(address indexed to, bytes32 indexed transferId, uint256 amount);
    event Deposit(address indexed by, uint256 amount, bytes32 indexed transferId);

    function deposit(address _token, uint256 _amount) public whenNotPaused {
        IERC20 token = IERC20(_token);
        require(token.balanceOf(msg.sender) >= _amount, "Not enough balance");
        require(token.allowance(msg.sender, address(this)) >= _amount, "Check the token allowance");
        
        bytes32 transferId = keccak256(abi.encodePacked(msg.sender, block.timestamp, _amount));
        require(!completedTransfers[transferId], "Transfer already completed");
        
        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer failed");
        
        completedTransfers[transferId] = true;
        emit Deposit(msg.sender, _amount, transferId);
    }

    function release(address _token, address _to, uint256 _amount, bytes32 _transferId) public onlyOwner {
        require(!completedTransfers[_transferId], "Transfer already completed");
        
        IERC20 token = IERC20(_token);
        require(token.balanceOf(address(this)) >= _amount, "Not enough balance in contract");

        bool success = token.transfer(_to, _amount);
        require(success, "Transfer failed");

        completedTransfers[_transferId] = true;
        emit TransferCompleted(_to, _transferId, _amount);
    }

}