const CONTRACTS = {
  dev: "0xCe6A45FeF1db200b242a1b5869F7473DB105129C",
  staging: "",
  demo: "0xf2d5DD9e4e7875a530eda1049Fb697CF726627F4",
};

const SUB_QUERY_URLS = {
  dev: "https://api.subquery.network/sq/Kourin1996/gaogao-key3-hackathon",
  staging: "",
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
