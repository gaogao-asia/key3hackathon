import { ethers } from "hardhat";
import { Accounts } from "../consts/accounts";
import { ProjectNames } from "../consts/projects";
import { uploadData } from "./ipfs";

const TRUSTX_CONTRACT_ADDRESS = process.env.TRUSTX_CONTRACT_ADDRESS;

async function main() {
  if (!TRUSTX_CONTRACT_ADDRESS) {
    throw new Error("TRUSTX_CONTRACT_ADDRESS is not set .env");
  }

  const TrustX = await ethers.getContractFactory("TrustX");
  const instance = TrustX.attach(TRUSTX_CONTRACT_ADDRESS);

  const projectName = ProjectNames[2];

  const ipfsContent = await uploadData({
    name: projectName,
    description:
      "スマートフォンをカーキーとして使用することができるアプリで、対応車両を操作できます。",
  });

  const tx = await instance.createDAO(
    `${ProjectNames[2]} 開発プロジェクト`,
    `ipfs://${ipfsContent.cid.toString()}`,
    false,
    Accounts.map((a) => a.address)
  );
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
