import { ethers } from "hardhat";

const TRUSTX_CONTRACT_ADDRESS = process.env.TRUSTX_CONTRACT_ADDRESS;

async function main() {
  if (!TRUSTX_CONTRACT_ADDRESS) {
    throw new Error("TRUSTX_CONTRACT_ADDRESS is not set .env");
  }

  const accounts = await ethers.getSigners();

  const TrustX = await ethers.getContractFactory("TrustX");
  const instance = TrustX.attach(TRUSTX_CONTRACT_ADDRESS);

  const tx = await instance.createDAO("Second DAO", "ipfs://fuga", true, [
    accounts[1].address,
  ]);
  const receipt = await tx.wait();

  const daoCreated = (receipt.events ?? []).find(
    (e) => e.event === "DAOCreated"
  );

  if (daoCreated) {
    console.log(`DAO created: ${daoCreated.args![0].toHexString()}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
