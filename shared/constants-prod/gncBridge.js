export const GNC_BRIDGE_ADDRESS = "0xfBCF0D011B6097B0b2d78bf13D0038Cca6275Eb3";
export const GNC_ABI_BRIDGE = [
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
  "function deposit() payable",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "function release(address,uint256,bytes32) payable",
  "function renounceOwnership()",
  "function transferOwnership(address)",
  "receive() payable"
];
