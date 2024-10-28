export const CHAIN_BRIDGE_ADDRESS = "0xFAeC51FA247019EA0100844dAF6a8D704884f55A";
export const CHAIN_ABI_BRIDGE = [
  "constructor(address)",
  "error EnforcedPause()",
  "error ExpectedPause()",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event Deposit(address,uint256)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "event Paused(address)",
  "event TransferCompleted(address indexed,uint256)",
  "event Unpaused(address)",
  "function depositToken(address,uint256)",
  "function owner() view returns (address)",
  "function pause()",
  "function paused() view returns (bool)",
  "function renounceOwnership()",
  "function transferOwnership(address)",
  "function transferToken(address,address,uint256)",
  "function unpause()",
  "function withdrawToken(address,uint256)"
];
