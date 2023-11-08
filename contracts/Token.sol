// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {

    string private message;
        
    constructor(address initialOwner)
        ERC20("Token", "TKN")
        Ownable(initialOwner)
    {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function setMessage(string memory amount) public {
        message = amount;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

}