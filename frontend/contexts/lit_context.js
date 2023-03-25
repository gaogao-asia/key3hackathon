import { createContext, useContext, useEffect, useMemo } from "react";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

const litContext = createContext(null);

export const LitContextProvider = (props) => {
  const client = useMemo(() => new LitJsSdk.LitNodeClient(), []);

  useEffect(() => {
    (async () => {
      try {
        await client.connect();
        console.log("connected to lit");
      } catch (error) {
        console.error("failed to connect to lit", error);
      }
    })();
  }, []);

  return (
    <litContext.Provider value={client}>{props.children}</litContext.Provider>
  );
};

export const useLitContext = () => {
  return useContext(litContext);
};
