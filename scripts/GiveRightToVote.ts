// COMPLETED AND EXECUTED

import { formatEther, toHex, Address } from "viem";
import { publicClient, deployerClient } from "./config";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
import * as readline from "readline";

dotenv.config();

/**
 * Function to confirm user action.
 * @param message - The confirmation message.
 * @returns Promise resolving to true if confirmed, false otherwise.
 */
async function confirmAction(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

/**
 * Function to grant voting rights to a specified wallet address.
 * @param contractAddress - The address of the deployed Ballot contract.
 * @param voterAddress - The wallet address of the voter to grant rights.
 */
async function giveRightToVote(contractAddress: Address, voterAddress: Address) {
  try {
    console.log(`\nGranting voting rights to: ${voterAddress}`);
    console.log(`Using Ballot Contract at: ${contractAddress}`);

    const isConfirmed = await confirmAction("Do you want to proceed with granting voting rights?");
    if (!isConfirmed) {
      console.log("Operation cancelled by the user.");
      process.exit(0);
    }

    // Invoke the giveRightToVote function
    const txHash = await deployerClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "giveRightToVote",
      args: [voterAddress],
    });

    console.log(`\nTransaction submitted. Hash: ${txHash}`);
    console.log("Waiting for transaction confirmation...");

    // Wait for the transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    if (Number(receipt.status) === 1) {
      console.log(`\n✅ Voting rights successfully granted to ${voterAddress}`);
      console.log(`🗳️  Transaction was confirmed in block ${receipt.blockNumber}`);
    } else {
      console.error(`\n❌ Transaction failed. Status: ${receipt.status}`);
    }
  } catch (error: any) {
    console.error("\n❗ An error occurred while granting voting rights:", error.message || error);
    process.exitCode = 1;
  }
}

/**
 * Entry point of the script.
 * Expects two command-line arguments:
 * 1. Contract Address
 * 2. Voter Address
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("⚠️  Usage: ts-node scripts/GiveRightToVote.ts <ContractAddress> <VoterAddress>");
    process.exit(1);
  }

  const [contractAddressInput, voterAddressInput] = args;

  // Validate Ethereum addresses
  const isValidAddress = (address: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(address);

  if (!isValidAddress(contractAddressInput)) {
    console.error("⚠️  Invalid Contract Address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters).");
    process.exit(1);
  }

  if (!isValidAddress(voterAddressInput)) {
    console.error("⚠️  Invalid Voter Address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters).");
    process.exit(1);
  }

  const contractAddress = contractAddressInput as Address;
  const voterAddress = voterAddressInput as Address;

  await giveRightToVote(contractAddress, voterAddress);
}

main().catch((error) => {
  console.error("❗ Script execution failed:", error);
  process.exitCode = 1;
});

export { main as giveRightToVote };

