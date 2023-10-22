// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ChainBridge is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    IERC20 public token;

    event BalanceBeforeTransfer(address indexed _to, uint256 balance);
    event BalanceAfterTransfer(address indexed _to, uint256 balance);

    function setToken(address _token) public onlyOwner {
        token = IERC20(_token);
    }

    function getBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function transferToken(address _to, uint256 _amount) public onlyOwner {
        require(token.balanceOf(address(this)) >= _amount, "Not enough balance in contract");

        uint256 balanceBeforeTransfer = token.balanceOf(_to);
        emit BalanceBeforeTransfer(_to, balanceBeforeTransfer);

        token.transfer(_to, _amount);

        uint256 balanceAfterTransfer = token.balanceOf(_to);
        emit BalanceAfterTransfer(_to, balanceAfterTransfer);
    }
}
