export const BRIDGE_ADDRESS = "0x457cCf29090fe5A24c19c1bc95F492168C0EaFdb";
export const ABI_BRIDGE = [
  "constructor(address) nonpayable",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event BalanceAfterTransfer(address indexed,uint256)",
  "event BalanceBeforeTransfer(address indexed,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "function deposit() payable",
  "function getBalance() view returns (uint256)",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function transferETH(address,uint256)",
  "function transferOwnership(address)"
];
