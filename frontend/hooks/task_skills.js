import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_TASK_SKILLS = gql`
  query GetTaskSkills($daoID: BigFloat!, $taskID: BigFloat!) {
    taskSkills(
      filter: { daoID: { equalTo: $daoID }, taskID: { equalTo: $taskID } }
    ) {
      nodes {
        id
        index
        skillName

        scores {
          nodes {
            reviewer
            score
          }
        }
      }
    }
  }
`;

export const useTaskSkills = (daoID, taskID) => {
  if (daoID && daoID.indexOf("0x") === 0) {
    daoID = Number.parseInt(daoID, 16).toString();
  }
  if (taskID && taskID.indexOf("0x") === 0) {
    taskID = Number.parseInt(taskID, 16).toString();
  }

  const result = useQuery(GET_TASK_SKILLS, {
    variables: { daoID, taskID },
  });

  return {
    ...result,
    data: result?.data
      ? {
          taskSkills: result.data.taskSkills.nodes
            .slice()
            .map((t) => {
              return {
                index: Number.parseInt(t.index),
                name: t.skillName,
                scores: t.scores.nodes.slice().map((s) => {
                  return {
                    score: Number.parseInt(s.score),
                    reviewer: s.reviewer,
                  };
                }),
              };
            })
            .sort((a, b) => a.index - b.index),
        }
      : result?.data,
  };
};
