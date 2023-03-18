import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import "hardhat-gas-reporter";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-watcher";
import "@primitivefi/hardhat-dodoc";
import { ethers } from "ethers";

require("dotenv").config();

const PRIVATE_KEYS = (process.env.PRIVATE_KEYS ?? "").split(",");

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  watcher: {
    compilation: {
      tasks: ["compile"],
      files: ["./contracts"],
      ignoredFiles: ["**/.vscode"],
      verbose: true,
      clearOnStart: true,
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 21,
  },
  dodoc: {
    runOnCompile: true,
    debugMode: true,
  },
  networks: {
    hardhat: {
      accounts: PRIVATE_KEYS.map((pk) => ({
        privateKey: pk,
        balance: ethers.utils.parseEther("1000000").toString(),
      })),
    },
    shibuya: {
      accounts: PRIVATE_KEYS,
      url: "https://evm.shibuya.astar.network",
    },
  },
};

export default config;
