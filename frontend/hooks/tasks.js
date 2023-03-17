import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_TASKS = gql`
  query GetTasks($daoID: BigFloat!) {
    tasks(filter: { daoID: { equalTo: $daoID } }) {
      nodes {
        id
        daoID
        taskID
        status
        name
        metadataURI
        isPrivate
        assigner
        createdBy
        createdTxHash
      }
    }
  }
`;

export const useTasks = (daoID) => {
  if (daoID.indexOf("0x") === 0) {
    daoID = Number.parseInt(daoID, 16).toString();
  }

  const result = useQuery(GET_TASKS, {
    variables: { daoID: daoID },
  });

  return {
    ...result,
    data: result.data
      ? {
          tasks: result.data.tasks.nodes,
        }
      : result.data,
  };
};
