export const CHAIN_BRIDGE_ADDRESS = "0xc2510D21b849223845010e12FBA718022467e30B";
export const CHAIN_ABI_BRIDGE = [
  "constructor(address)",
  "error EnforcedPause()",
  "error ExpectedPause()",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event Deposit(address indexed,uint256,bytes32 indexed)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "event Paused(address)",
  "event TransferCompleted(address indexed,bytes32 indexed,uint256)",
  "event Unpaused(address)",
  "function completedTransfers(bytes32) view returns (bool)",
  "function deposit(address,uint256)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "function release(address,address,uint256,bytes32)",
  "function renounceOwnership()",
  "function transferOwnership(address)"
];
