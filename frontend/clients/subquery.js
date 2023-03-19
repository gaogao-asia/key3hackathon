import { ApolloClient, InMemoryCache } from "@apollo/client";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const { subQueryURL } = publicRuntimeConfig;

console.log("init::subQueryURL", subQueryURL);

export const client = new ApolloClient({
  uri: subQueryURL,
  cache: new InMemoryCache(),
});
