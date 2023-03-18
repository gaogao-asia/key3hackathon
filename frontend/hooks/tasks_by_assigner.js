import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_TASKS_BY_ASSIGNER = gql`
  query GetTasks($assigner: String!) {
    tasks(filter: { assigner: { equalTo: $assigner } }) {
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
        createdBlockHeight

        reviewers {
          nodes {
            account {
              address
            }

            approved
          }
        }

        dao {
          name
        }
      }
    }
  }
`;

export const useTasksByAssigner = (assigner) => {
  const result = useQuery(GET_TASKS_BY_ASSIGNER, {
    variables: { assigner },
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
