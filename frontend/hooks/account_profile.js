import { useAccount } from "wagmi";
import { Accounts } from "../consts/accounts";

export const useAccountProfile = (address) => {
  return Accounts.find((a) => a.address === address);
};

export const useMyProfile = () => {
  const { address } = useAccount();

  return useAccountProfile(address);
};
