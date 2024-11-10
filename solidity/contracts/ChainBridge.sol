// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Bridge.sol";

contract ChainBridge is Pausable, ReentrancyGuard, Bridge {

    uint256 public fee; // Fee in wei

    constructor(address initialOwner, uint256 initialFee) Bridge(initialOwner) {
        fee = initialFee;
    }

    function updateFee(uint256 newFee) public onlyOwner {
        fee = newFee;
    }

    function deposit(address _token, uint256 _amount) public payable whenNotPaused nonReentrant {
        IERC20 token = IERC20(_token);
        require(token.balanceOf(msg.sender) >= _amount, "Not enough balance");
        require(token.allowance(msg.sender, address(this)) >= _amount, "Check the token allowance");
        require(msg.value == fee, "Incorrect fee amount");

        processDeposit(_amount);

        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer failed");

        // Transfer the fee to the owner
        payable(owner()).transfer(fee);

    }

    function release(address _token, address _to, uint256 _amount, bytes32 _transferId) public onlyOwner nonReentrant notCompleted(_transferId) {
        IERC20 token = IERC20(_token);
        require(token.balanceOf(address(this)) >= _amount, "Not enough balance in contract");
        
        processRelease(_to, _amount, _transferId);

        bool success = token.transfer(_to, _amount);
        require(success, "Transfer failed");

    }

}
