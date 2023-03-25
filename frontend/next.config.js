const CONTRACTS = {
  dev: "0xCe6A45FeF1db200b242a1b5869F7473DB105129C",
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
    trustXACLContract: "0x26e49D3beb6aBF5c5b048575bB4Fb2C6cf5fC3e8",
  },
};
