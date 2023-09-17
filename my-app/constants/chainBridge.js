export const BRIDGE_ADDRESS = "0x9A676e781A523b5d0C0e43731313A708CB607508";
export const ABI_BRIDGE = [
  "event BalanceAfterTransfer(address indexed,uint256)",
  "event BalanceBeforeTransfer(address indexed,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "function getBalance() view returns (uint256)",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function setToken(address)",
  "function token() view returns (address)",
  "function transferOwnership(address)",
  "function transferToken(address,uint256)"
];
