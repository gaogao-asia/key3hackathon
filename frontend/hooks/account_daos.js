import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_ACCOUNT_DAOS = gql`
  query GetAccountDaos($address: String!) {
    account(id: $address) {
      address
      daos {
        nodes {
          dao {
            daoID
            name
          }
        }
      }
    }
  }
`;

export const useAccountDAOs = (address) => {
  const result = useQuery(GET_ACCOUNT_DAOS, {
    variables: { address },
  });

  return {
    ...result,
    data: result?.data
      ? {
          account: {
            address: result.data.account.address,
            daos: result.data.account.daos.nodes.slice().map((n) => {
              return {
                id: n.dao.daoID,
                name: n.dao.name
              }
            })
          }
        }
      : result?.data,
  };
};
