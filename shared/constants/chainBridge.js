export const CHAIN_BRIDGE_ADDRESS = "0xF94d9aEbF7F1bAB6e2eFA0C4D0aaA7766beF1c4D";
export const CHAIN_ABI_BRIDGE = [
  "constructor(address)",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event Deposit(address,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "event TransferCompleted(address indexed,uint256)",
  "function depositToken(address,uint256)",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function transferOwnership(address)",
  "function transferToken(address,address,uint256)",
  "function withdrawToken(address,uint256)"
];
