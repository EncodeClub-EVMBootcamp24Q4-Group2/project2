// COMPLETED AND EXECUTED

import { Address, toHex } from "viem";
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
 * Function to delegate voting rights to a specified wallet address.
 * @param contractAddress - The address of the deployed Ballot contract.
 * @param destinationAddress - The wallet address to delegate the vote to.
 */
async function delegateVote(contractAddress: Address, destinationAddress: Address) {
  try {
    console.log(`\nDelegating vote to: ${destinationAddress}`);
    console.log(`Using Ballot Contract at: ${contractAddress}`);

    // Fetch voter's status
    const voter = await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "voters",
      args: [deployerClient.account.address],
    }) as any;

    const [weight, voted, delegate, vote] = voter;

    console.log(`\n--- Voter Status ---`);
    console.log(`Address: ${deployerClient.account.address}`);
    console.log(`Weight: ${weight.toString()}`);
    console.log(`Voted: ${voted}`);
    if (voted) {
      console.log(`Delegated To: ${delegate}`);
      console.log(`Voted For Proposal Index: ${vote.toString()}`);
      console.log("You have already voted or delegated your vote. Cannot delegate again.");
      process.exit(1);
    }

    if (weight === 0n) {
      console.log("\nError: This address has no voting rights.");
      console.log("The chairperson must grant voting rights before you can delegate.");
      process.exit(1);
    }

    // Confirm the action with the user
    const isConfirmed = await confirmAction(`Do you want to delegate your vote to ${destinationAddress}?`);
    if (!isConfirmed) {
      console.log("Operation cancelled by the user.");
      process.exit(0);
    }

    // Delegate the vote
    const txHash = await deployerClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "delegate",
      args: [destinationAddress],
    });

    console.log(`\nTransaction submitted. Hash: ${txHash}`);
    console.log("Waiting for transaction confirmation...");

    // Wait for the transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    // Fixing the TypeScript error by comparing with '0x1'
    if (Number(receipt.status) === 1) {
      console.log(`\n✅ Successfully delegated your vote to ${destinationAddress}`);
      console.log(`🗳️  Transaction was confirmed in block ${receipt.blockNumber}`);
    } else {
      console.error(`\n❌ Transaction failed. Status: ${receipt.status}`);
    }
  } catch (error: any) {
    console.error("\n❗ An error occurred while delegating your vote:", error.message || error);
    process.exitCode = 1;
  }
}

/**
 * Entry point of the script.
 * Expects two command-line arguments:
 * 1. Contract Address
 * 2. Destination Wallet Address
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("⚠️  Usage: ts-node scripts/DelegateVote.ts <ContractAddress> <DestinationWalletAddress>");
    process.exit(1);
  }

  const [contractAddressInput, destinationAddressInput] = args;

  // Validate Ethereum addresses
  const isValidAddress = (address: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(address);

  if (!isValidAddress(contractAddressInput)) {
    console.error("⚠️  Invalid Contract Address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters).");
    process.exit(1);
  }

  if (!isValidAddress(destinationAddressInput)) {
    console.error("⚠️  Invalid Destination Wallet Address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters).");
    process.exit(1);
  }

  const contractAddress = contractAddressInput as Address;
  const destinationAddress = destinationAddressInput as Address;

  await delegateVote(contractAddress, destinationAddress);
}

main().catch((error) => {
  console.error("❗ Script execution failed:", error);
  process.exitCode = 1;
});

export { main as delegateVote };
