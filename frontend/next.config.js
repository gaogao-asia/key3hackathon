const CONTRACTS = {
  dev: "0xd46D117FA851FBFD33818261EfA26f9CC3Eb47A0",
  demo: "0x9F0a36E1A090dc5db4836A4D5c5bF88D21A68003",
};

const SUB_QUERY_URLS = {
  dev: "https://api.subquery.network/sq/Kourin1996/gaogao-key3-hackathon",
  demo: "https://api.subquery.network/sq/Kourin1996/gaogao-key3-hackathon-demo",
};

module.exports = {
  images: {
    domains: ["randomuser.me"],
  },
  serverRuntimeConfig: {
    ipfsProjectID: process.env.INFURA_IPFS_PROJECT_ID,
    ipfsAPISecret: process.env.INFURA_IPFS_API_SECRET,
  },
  publicRuntimeConfig: {
    trustXContract: CONTRACTS[process.env.NEXT_PUBLIC_ENV],
    subQueryURL: SUB_QUERY_URLS[process.env.NEXT_PUBLIC_ENV],
  },
};
