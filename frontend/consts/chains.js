export const shibuya = {
    id: 81,
    name: 'Shibuya',
    network: 'shibuya',
    nativeCurrency: {
      decimals: 18,
      name: 'Shibuya',
      symbol: 'SBY',
    },
    rpcUrls: {
      public: { http: [process.env.NEXT_PUBLIC_RPC_URL_SHIBUYA] },
      default: { http: ['https://evm.shibuya.astar.network'] },
    },
    blockExplorers: {
      bloskscount: { name: 'SnowTrace', url: 'https://blockscout.com/shibuya' },
    },
    contracts: {},
  };

export const hardhat = {
  id: 81,
  name: 'Hardhat',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'Eth',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {},
  contracts: {},
};