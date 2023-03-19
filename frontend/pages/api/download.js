import getConfig from "next/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Only POST method allowed" });
    return;
  }

  const { serverRuntimeConfig } = getConfig();
  const { ipfsProjectID, ipfsAPISecret } = serverRuntimeConfig;

  try {
    const body = JSON.parse(req.body);

    const result = await fetch(
      `https://ipfs.infura.io:5001/api/v0/cat?arg=${body.cid}`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${ipfsProjectID}:${ipfsAPISecret}`).toString("base64"),
        },
      }
    );

    const rawText = await result.text();

    res.status(200).json({ result: rawText });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
