import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_TASK = gql`
  query GetTasks($id: String!) {
    task(id: $id) {
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

      reviewers {
        nodes {
          account {
            address
          }
        }
      }

      skills {
        nodes {
          index
          skillName
          skill {
            id
          }
        }
      }
    }
  }
`;

export const useTask = (daoPrimaryID) => {
  const result = useQuery(GET_TASK, {
    variables: { id: daoPrimaryID },
  });

  return {
    ...result,
    data: result.data
      ? {
          task: {
            ...result.data.task,
            reviewers: result.data.task.reviewers.nodes.map(
              (n) => n.account.address
            ),
            skills: result.data.task.skills.nodes
              .map((n) => ({
                index: Number.parseInt(n.index),
                id: n.skill.id,
                name: n.skillName,
              }))
              .sort((a, b) => a.index - b.index),
          },
        }
      : result.data,
  };
};
