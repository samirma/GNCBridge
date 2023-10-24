export const BRIDGE_ADDRESS = "0xab16A69A5a8c12C732e0DEFF4BE56A70bb64c926";
export const ABI_BRIDGE = [
  "constructor(address) nonpayable",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event BalanceAfterTransfer(address indexed,uint256)",
  "event BalanceBeforeTransfer(address indexed,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "function depositToken(uint256)",
  "function getBalance() view returns (uint256)",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function setToken(address)",
  "function token() view returns (address)",
  "function transferOwnership(address)",
  "function transferToken(address,uint256)",
  "function withdrawToken(uint256)"
];
