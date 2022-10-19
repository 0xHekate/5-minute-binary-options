// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import dotenv from "dotenv";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  // We get the contract to deploy

  dotenv.config();

  const BLOCK_COUNT_MULTPLIER = 13; // 13 average block time in shibuya
  const INTERVAL_SECONDS = 23 * BLOCK_COUNT_MULTPLIER; // approximately 300s
  const BUFFER_SECONDS = 2 * BLOCK_COUNT_MULTPLIER; // approximately 26 seconds, round must lock/end within this buffer
  const MIN_BET_AMOUNT = 1000; // 1
  const UPDATE_ALLOWANCE = 4 * BLOCK_COUNT_MULTPLIER; // approximately 52 seconds

  const INITIAL_TREASURY_RATE = 0.1; // 10%
  const PAIR_PRICE = "ASTR/USD";

  const BinaryOptions = await ethers.getContractFactory("BinaryOptions");
  const bo = await BinaryOptions.deploy(
    String(process.env.ORACLE),
    String(process.env.ADMIN),
    String(process.env.OPERATOR),
    INTERVAL_SECONDS,
    BUFFER_SECONDS,
    MIN_BET_AMOUNT,
    UPDATE_ALLOWANCE,
    String(INITIAL_TREASURY_RATE * 10000),
    PAIR_PRICE
  );
  console.log("Astar token deployed to:", bo.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
