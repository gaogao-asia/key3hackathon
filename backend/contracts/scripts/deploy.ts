import { ethers, upgrades } from "hardhat";

async function main() {
  const Lock = await ethers.getContractFactory("Lock");
  const instance = await upgrades.deployProxy(Lock, [
    new Date().getTime() + 10,
  ]);
  await instance.deployed();

  console.log(`Lock v1 deployed: ${instance.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
