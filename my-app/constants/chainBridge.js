export const CHAIN_BRIDGE_ADDRESS = "0x9E2971A698D6F9558811C98e15feA06E012c6f21";
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
