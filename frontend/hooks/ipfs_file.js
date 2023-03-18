import { useEffect, useState } from "react";
import { downloadFromIPFS } from "../clients/ipfs";

export const useIPFSData = (metadataURI) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!metadataURI) {
      return;
    }

    const cid = metadataURI.replace("ipfs://", "");
    setData(null);
    setLoading(true);

    (async () => {
      try {
        const data = JSON.parse(await downloadFromIPFS(cid));

        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [metadataURI]);

  return { data, loading };
};
