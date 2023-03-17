import getConfig from "next/config";
import { create } from "ipfs-http-client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Only POST method allowed" });
    return;
  }

  const { serverRuntimeConfig } = getConfig();
  const { ipfsProjectID, ipfsAPISecret } = serverRuntimeConfig;

  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization:
        "Basic " +
        Buffer.from(`${ipfsProjectID}:${ipfsAPISecret}`).toString("base64"),
    },
  });

  try {
    const result = await ipfs.add({
      content: req.body,
    });

    await ipfs.pin.add(result.cid);

    res.status(200).json({ cid: result.cid.toString() });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
