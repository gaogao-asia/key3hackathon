import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const { trustXContract, trustXACLContract } = publicRuntimeConfig;

export const TRUST_X_CONTRACT_SHIBUYA = trustXContract;
export const TRUST_X_ACL_CONTRACT = trustXACLContract;
