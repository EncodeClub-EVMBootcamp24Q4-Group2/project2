// STATUS: COMPLETED AND EXECUTED

import { formatEther, toHex } from "viem";
import { publicClient, deployerClient } from "./config";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";

import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");

  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  const balance = await publicClient.getBalance({
    address: deployerClient.account.address,
    });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployerClient.chain.nativeCurrency.symbol
  );

  console.log("Deploying Ballot contract");
  const hash = await deployerClient.deployContract({
    abi,
      bytecode: bytecode as `0x${string}`,
      args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
    });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);
  return receipt.contractAddress;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export { main as deployBallot };