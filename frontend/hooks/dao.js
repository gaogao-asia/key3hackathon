import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_DAO = gql`
  query GetDAO($id: String!) {
    dao(id: $id) {
      id
      daoID
      name
      metadataURI
      isPrivate
      createdBy

      numTasks

      createdTxHash
      createdAt
      createdBlockHeight

      members {
        nodes {
          id
          account {
            id
            address
          }
        }
      }
    }
  }
`;

export const useDAO = (id) => {
  const result = useQuery(GET_DAO, {
    variables: { id: id },
  });

  return {
    ...result,
    ...(result?.data
      ? {
          data: {
            dao: result.data.dao,
            members: (result.data?.dao?.members?.nodes ?? [])
              .slice()
              .map((n) => n.account.address),
          },
        }
      : {}),
  };
};
