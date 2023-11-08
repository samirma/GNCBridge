export const BRIDGE_ADDRESS = "0xA7c59f010700930003b33aB25a7a0679C860f29c";
export const ABI_BRIDGE = [
  "constructor(address) nonpayable",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event BalanceAfterTransfer(address indexed,uint256)",
  "event BalanceBeforeTransfer(address indexed,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "function depositToken(address,uint256)",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function transferOwnership(address)",
  "function transferToken(address,address,uint256)",
  "function withdrawToken(address,uint256)"
];
