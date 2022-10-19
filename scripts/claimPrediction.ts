import { ethers, network } from "hardhat";
import predictionABI from "../artifacts/contracts/BinaryOptions.sol/BinaryOptions.json";
import dotenv from "dotenv";

const main = async () => {
  // Get network data from Hardhat config (see hardhat.config.ts).
  const networkName = network.name;
  dotenv.config();

  // Get signer to sign the transaction(s).
  const [operator] = await ethers.getSigners();

  if (process.env.PREDICTION_CONTRACT === ethers.constants.AddressZero) {
    throw new Error(
      "Missing smart contract (prediction / predictionOracle) addresses."
    );
  }

  // Bind the smart contract address to the ABI, for a given network.
  const contract = await ethers.getContractAt(
    predictionABI.abi,
    String(process.env.PREDICTION_CONTRACT)
  );

  const currentEpoch = await contract.currentEpoch();
  const tx = await contract.claim([currentEpoch], { from: operator.address });
  const receipt = await tx.wait();
  console.log(
    // @ts-ignore
    receipt.events?.filter((x) => {
      return x.event !== "";
    })
  );

  const message = `[${new Date().toISOString()}] network=${networkName} message='Claim' hash=${
    tx?.hash
  } signer=${operator.address}`;
  console.log(message);
};

main().catch((error) => {
  console.error(error);
  throw new Error(error);
});
