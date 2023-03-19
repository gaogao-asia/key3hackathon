import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_ACCOUNT_SKILLS = gql`
  query GetAccountSkills($address: String!) {
    accountSkills(filter: { address: { equalTo: $address } }) {
      nodes {
        id
        address
        score
        skill {
          id
          name
        }
      }
    }
  }
`;

export const useAccountSkills = (address) => {
  const result = useQuery(GET_ACCOUNT_SKILLS, {
    variables: { address },
  });

  return {
    ...result,
    data: result?.data
      ? {
          skills: (result?.data?.accountSkills?.nodes ?? [])
            .slice()
            .map((s) => {
              return {
                address: s.address,
                score: Number.parseInt(s.score),
                skill: s.skill.name,
              };
            }),
        }
      : result?.data,
  };
};
