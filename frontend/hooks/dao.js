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
    }
  }
`;

export const useDAO = (id) => {
  return useQuery(GET_DAO, {
    variables: { id: id },
    pollInterval: 5000,
  });
};
