import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useMemo } from "react";

const GET_NOTIFICATIONS = gql`
  query GetNotifications(
    $daoID: BigFloat!
    $to: String!
    $nonceFrom: BigFloat!
  ) {
    notifications(
      filter: {
        daoID: { equalTo: $daoID }
        to: { equalTo: $to }
        nonce: { greaterThanOrEqualTo: $nonceFrom }
      }
    ) {
      nodes {
        id
        daoID
        to
        nonce
        title
        message
        createdAt
        createdBlockHeight
      }
    }
  }
`;

export const useNotifications = (daoID, to, nonceFrom) => {
  if (daoID.indexOf("0x") === 0) {
    daoID = Number.parseInt(daoID, 16).toString();
  }

  const result = useQuery(GET_NOTIFICATIONS, {
    variables: { daoID, to, nonceFrom },
    pollInterval: 5000,
  });

  return useMemo(() => {
    return {
      ...result,
      data: result?.data
        ? {
            notifications: (result?.data?.notifications?.nodes ?? [])
              .slice()
              .sort((a, b) => {
                return Number.parseInt(a.nonce) - Number.parseInt(b.nonce);
              }),
          }
        : result?.data,
    };
  }, result.data);
};
