import { ethers } from "hardhat";
import { TrustXACL } from "../typechain-types";

async function main() {
  const signers = await ethers.getSigners();
  const TrustXACL = await ethers.getContractFactory("TrustXACL");
  const instance = (await TrustXACL.attach(
    "0x26e49D3beb6aBF5c5b048575bB4Fb2C6cf5fC3e8"
  )) as TrustXACL;
  await instance.deployed();

  console.log("DAO: 0x0");
  for (let i = 0; i < signers.length; i++) {
    console.log(`${i} => ${await instance.balanceOf(signers[i].address, 0x0)}`);
  }

  console.log("DAO: 0x1");

  for (let i = 0; i < signers.length; i++) {
    console.log(`${i} => ${await instance.balanceOf(signers[i].address, 0x1)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
