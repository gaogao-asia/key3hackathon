import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      nodes {
        address
        daos {
          nodes {
            dao {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const useAccounts = () => {
  const result = useQuery(GET_ACCOUNTS);

  if (!result.data) {
    return result;
  }

  return {
    ...result,
    data: {
      accounts: result.data.accounts.nodes.slice().map((a) => ({
        address: a.address,
        daos: a.daos.nodes.slice().map((n) => ({
          id: n.dao.id,
          name: n.dao.name,
        })),
      })),
    },
  };
};
