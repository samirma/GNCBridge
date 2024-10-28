// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ChainBridge is Ownable, Pausable {
    
    constructor(address initialOwner) Ownable(initialOwner) {}

    event TransferCompleted(address indexed to, uint256 amount);
    event Deposit(address by, uint256 amount);

    function depositToken(address _token, uint256 _amount) public whenNotPaused {
        IERC20 token = IERC20(_token);
        require(token.balanceOf(msg.sender) >= _amount, "Not enough balance");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        token.transferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _amount);
    }

    function withdrawToken(address _token, uint256 _amount) public onlyOwner {
        IERC20 token = IERC20(_token);
        require(token.balanceOf(address(this)) >= _amount, "Not enough balance in contract");
        token.transfer(msg.sender, _amount);
    }

    function transferToken(address _token, address _to, uint256 _amount) public onlyOwner {
        IERC20 token = IERC20(_token);
        require(token.balanceOf(address(this)) >= _amount, "Not enough balance in contract");

        token.transfer(_to, _amount);

        emit TransferCompleted(_to, _amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
