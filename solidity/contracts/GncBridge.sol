// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Bridge.sol";

contract GncBridge is Pausable, ReentrancyGuard, Bridge {
    
    constructor(address initialOwner) Bridge(initialOwner) {}

    function deposit() public payable nonReentrant {
        require(msg.value > 0, "You need to send some Ether");
        
        processDeposit(msg.value);

        payable(owner()).transfer(msg.value);
    }

    function release(address payable _to, uint256 _amount, bytes32 _transferId) public payable nonReentrant onlyOwner notCompleted(_transferId) {
        
        processRelease(_to, _amount, _transferId);

        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed");
    }

    receive() external payable {
        revert("Use deposit function to send Ether");
    }

}