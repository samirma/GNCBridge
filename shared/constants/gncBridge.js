export const GNC_BRIDGE_ADDRESS = "0x71C65cf8a1E9E5f748b56e055BbB423e4EBC16a9";
export const GNC_ABI_BRIDGE = [
  "constructor(address)",
  "error OwnableInvalidOwner(address)",
  "error OwnableUnauthorizedAccount(address)",
  "event Deposit(address indexed,uint256,bytes32 indexed)",
  "event OwnershipTransferred(address indexed,address indexed)",
  "event TransferCompleted(address indexed,bytes32 indexed,uint256)",
  "function completedTransfers(bytes32) view returns (bool)",
  "function deposit() payable",
  "function owner() view returns (address)",
  "function release(address,uint256,bytes32) payable",
  "function renounceOwnership()",
  "function transferOwnership(address)",
  "receive() payable"
];
