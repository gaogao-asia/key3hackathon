import { ApolloClient, InMemoryCache } from "@apollo/client";

const SUBQUERY_URL =
  "https://api.subquery.network/sq/Kourin1996/gaogao-key3-hackathon";

export const client = new ApolloClient({
  uri: SUBQUERY_URL,
  cache: new InMemoryCache(),
});
