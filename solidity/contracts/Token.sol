// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20 {

    string private message;
        
    constructor() ERC20("Token", "TKN")
    {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function setMessage(string memory amount) public {
        message = amount;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

}