import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_TASK_THREADS = gql`
  query GetTaskThreads($daoID: BigFloat!, $taskID: BigFloat!) {
    threads(
      filter: { daoID: { equalTo: $daoID }, taskID: { equalTo: $taskID } }
    ) {
      nodes {
        id
        daoID
        taskID
        threadID
        threadType
        messageURI
        isPrivate
        createdBy
        createdTxHash
        createdAt
        createdBlockHeight
      }
    }
  }
`;

export const useTaskThreads = (daoID, taskID) => {
  if (daoID && daoID.indexOf("0x") === 0) {
    daoID = Number.parseInt(daoID, 16).toString();
  }
  if (taskID && taskID.indexOf("0x") === 0) {
    taskID = Number.parseInt(taskID, 16).toString();
  }

  const result = useQuery(GET_TASK_THREADS, {
    variables: { daoID, taskID },
  });

  return {
    ...result,
    data: result?.data
      ? {
          threads: result?.data?.threads?.nodes.slice().sort((a, b) => {
            return Number.parseInt(a.threadID) - Number.parseInt(b.threadID);
          }),
        }
      : result?.data,
  };

  return;
};
