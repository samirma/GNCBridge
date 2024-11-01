export const TOKEN_ADDRESS = "0x36ec6622b5227e3a7e4d085f1dfc1dc8f5192289";
export const TOKEN_ABI = [
  "constructor(address)",
  "error ERC20InsufficientAllowance(address,uint256,uint256)",
  "error ERC20InsufficientBalance(address,uint256,uint256)",
  "error ERC20InvalidApprover(address)",
  "error ERC20InvalidReceiver(address)",
  "error ERC20InvalidSender(address)",
  "error ERC20InvalidSpender(address)",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event Approval(address indexed,address indexed,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "event Transfer(address indexed,address indexed,uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function getMessage() view returns (string)",
  "function mint(uint256)",
  "function name() view returns (string)",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function setMessage(string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function transferFrom(address,address,uint256) returns (bool)",
  "function transferOwnership(address)"
];
