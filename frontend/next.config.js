module.exports = {
  images: {
    domains: ["randomuser.me"],
  },
  serverRuntimeConfig: {
    ipfsProjectID: process.env.INFURA_IPFS_PROJECT_ID,
    ipfsAPISecret: process.env.INFURA_IPFS_API_SECRET,
  },
};
