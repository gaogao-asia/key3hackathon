import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const { trustXContract } = publicRuntimeConfig;

console.log("init::trustXContract", trustXContract);

export const TRUST_X_CONTRACT_SHIBUYA = trustXContract;
