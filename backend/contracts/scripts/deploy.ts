import { ethers, upgrades } from "hardhat";

async function main() {
  const TrustX = await ethers.getContractFactory("TrustX");
  const instance = await upgrades.deployProxy(TrustX, []);
  await instance.deployed();

  console.log(`TrustX v1 deployed: ${instance.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
