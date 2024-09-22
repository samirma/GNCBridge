export const GNC_BRIDGE_ADDRESS = "0xfBCF0D011B6097B0b2d78bf13D0038Cca6275Eb3";
export const GNC_ABI_BRIDGE = [
  "constructor(address)",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event BalanceAfterTransfer(address indexed,uint256)",
  "event BalanceBeforeTransfer(address indexed,uint256)",
  "event Deposit(address,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "function deposit(uint256) payable",
  "function getBalance() view returns (uint256)",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function transferETH(address,uint256)",
  "function transferOwnership(address)"
];
