import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { AccountsMap } from "../consts/accounts";

const GET_ACCOUNTS_SKILLS = gql`
  query GetAccountsSkills {
    accountSkills {
      nodes {
        address
        score
        skill {
          name
        }
      }
    }
  }
`;

export const useAccountsSkills = (
  name,
  skills
) => {
  const result = useQuery(GET_ACCOUNTS_SKILLS);

  if (!result.data) {
    return result;
  }

  const accountSkills = (result.data.accountSkills.nodes ?? []).slice().filter((s) => {
    return (name.length === 0 || (AccountsMap[s.address]?.fullname ?? "").indexOf(name) !== -1) && (skills.length === 0 || skills.includes(s.skill.name) && Number.parseInt(s.score) > 0)
  });

  return {
    ...result,
    data: {
      accounts: [...new Set(
        accountSkills.map((s) => s.address)
      )]
    }
  }
};
