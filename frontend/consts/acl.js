import { TRUST_X_ACL_CONTRACT } from "./contracts";

export const getACL = (daoID) => {
  return [
    {
      contractAddress: TRUST_X_ACL_CONTRACT,
      standardContractType: "ERC1155",
      chain: "mumbai",
      method: "balanceOf",
      parameters: [":userAddress", daoID],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];
};
