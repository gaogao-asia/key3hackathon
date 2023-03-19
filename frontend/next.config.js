const CONTRACTS = {
  dev: "0x45354E227CEc59369a439BeC5134D08Be293d4E0",
  demo: "0x9c9746B5c46F95b3AE503467fBFBB814e0613681",
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
