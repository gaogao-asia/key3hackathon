import { useEffect, useState } from "react";
import { downloadFromIPFS } from "../clients/ipfs";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useLitContext } from "../contexts/lit_context";
import { getACL } from "../consts/acl";
import { DAO_ID } from "../consts/daos";
import { useAccount } from "wagmi";

async function tryDecrypt(
  address,
  litNodeClient,
  encryptedSymmetricKey,
  encryptedDescription
) {
  const asg = localStorage.getItem("lit-auth-signature");
  if (asg === null || JSON.parse(asg).address !== address) {
    const networkVersion = await window.ethereum.request({
      method: "net_version",
    });

    console.log("debug::networkVersion", networkVersion);

    if (networkVersion != "80001") {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });

      console.log("debug::switched to mumbai");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  await litNodeClient.connect();

  const authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain: "mumbai",
    switchChain: true,
  });

  console.log("debug::authSig", authSig);

  console.log("debug::getEncryptionKey", {
    accessControlConditions: getACL(DAO_ID),
    toDecrypt: encryptedSymmetricKey,
    chain: "mumbai",
    authSig,
  });

  const symmetricKey = await litNodeClient.getEncryptionKey({
    accessControlConditions: getACL(DAO_ID),
    toDecrypt: encryptedSymmetricKey,
    chain: "mumbai",
    authSig,
  });

  console.log("debug::symmetricKey", symmetricKey);

  const decryptedText = await LitJsSdk.decryptString(
    LitJsSdk.base64StringToBlob(encryptedDescription),
    symmetricKey
  );

  return decryptedText;
}

export const useIPFSData = (metadataURI) => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const litNodeClient = useLitContext();

  useEffect(() => {
    if (!metadataURI) {
      return;
    }

    const cid = metadataURI.replace("ipfs://", "");
    setData(null);
    setLoading(true);

    (async () => {
      try {
        let data = JSON.parse(await downloadFromIPFS(cid));
        console.log("debug::rawData", data);

        if (data.isPrivate) {
          try {
            console.log(
              "debug::window.ethereum.networkVersion",
              window.ethereum.networkVersion
            );

            const res = await Promise.race([
              tryDecrypt(
                address,
                litNodeClient,
                data.encryptedSymmetricKey,
                data.description
              ),
              new Promise((_resolve, reject) =>
                setTimeout(() => reject(new Error("timeout")), 30 * 1000)
              ),
            ]);

            console.log("debug::res", res);

            data = {
              ...data,
              description: res,
            };
          } catch (error) {
            console.log("debug::failed to decrypt", error);

            data = {
              ...data,
              description: `(encrypted) ${data.description}`,
            };
          }
        }

        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);

        const networkVersion = await window.ethereum.request({
          method: "net_version",
        });

        if (networkVersion != "81") {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x51" }],
          });
        }
      }
    })();
  }, [metadataURI]);

  return { data, loading };
};
