import { ethers } from "hardhat";
import { Accounts } from "../consts/accounts";
import { TrustXACL } from "../typechain-types";

async function main() {
  const TrustXACL = await ethers.getContractFactory("TrustXACL");
  const instance = (await TrustXACL.deploy()) as TrustXACL;
  await instance.deployed();

  console.log(`TrustX ACL deployed: ${instance.address}`);

  await instance.addMembers(0x0, [
    Accounts[0].address,
    Accounts[1].address,
    Accounts[2].address,
    Accounts[3].address,
    Accounts[4].address,
    Accounts[5].address,
  ]);

  await instance.addMembers(0x1, [
    Accounts[4].address,
    Accounts[6].address,
    Accounts[7].address,
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
