import { create } from "ipfs-http-client";
const fetch = require("node-fetch");

const INFURA_IPFS_PROJECT_ID = process.env.INFURA_IPFS_PROJECT_ID;
const INFURA_IPFS_API_SECRET = process.env.INFURA_IPFS_API_SECRET;

const getInfuraIPFSAuthHeader = () => {
  if (!INFURA_IPFS_PROJECT_ID) {
    throw new Error("INFURA_IPFS_PROJECT_ID is not set in env");
  }
  if (!INFURA_IPFS_API_SECRET) {
    throw new Error("INFURA_IPFS_API_SECRET is not set in env");
  }

  return (
    "Basic " +
    Buffer.from(`${INFURA_IPFS_PROJECT_ID}:${INFURA_IPFS_API_SECRET}`).toString(
      "base64"
    )
  );
};

export const createIPFSClient = () => {
  return create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: getInfuraIPFSAuthHeader(),
    },
  });
};

export const uploadData = async (data: any) => {
  const ipfs = createIPFSClient();

  const result = await ipfs.add({
    content: JSON.stringify(data),
  });

  await ipfs.pin.add(result.cid);

  return result;
};

export const downloadData = async (cid: string) => {
  const res = await fetch(`https://ipfs.infura.io:5001/api/v0/cat?arg=${cid}`, {
    method: "POST",
    headers: {
      Authorization: getInfuraIPFSAuthHeader(),
    },
  });

  return res.text();
};
