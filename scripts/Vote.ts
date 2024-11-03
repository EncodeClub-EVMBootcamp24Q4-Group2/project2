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
 * Function to cast a vote for a specified proposal.
 * @param contractAddress - The address of the deployed Ballot contract.
 * @param proposalIndex - The index of the proposal to vote for (0, 1, or 2).
 */
async function castVote(contractAddress: Address, proposalIndex: number) {
  try {
    console.log(`\nCasting vote for Proposal Index: ${proposalIndex}`);
    console.log(`Using Ballot Contract at: ${contractAddress}`);

    // Verify if the caller has the right to vote
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
      console.log("You have already voted. Cannot vote again.");
      process.exit(1);
    }

    if (weight === 0n) {
      console.log("\nError: This address has no voting rights.");
      console.log("The chairperson must grant voting rights before you can vote.");
      process.exit(1);
    }

    // Confirm the action with the user
    const isConfirmed = await confirmAction(`Do you want to cast your vote for proposal index ${proposalIndex}?`);
    if (!isConfirmed) {
      console.log("Operation cancelled by the user.");
      process.exit(0);
    }

    // Cast the vote
    const txHash = await deployerClient.writeContract({
      address: contractAddress,
      abi,
      functionName: "vote",
      args: [BigInt(proposalIndex)],
    });

    console.log(`\nTransaction submitted. Hash: ${txHash}`);
    console.log("Waiting for transaction confirmation...");

    // Wait for the transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    if (Number(receipt.status) === 1) {
      console.log(`\n✅ Vote successfully cast for proposal index ${proposalIndex}`);
      console.log(`🗳️  Transaction was confirmed in block ${receipt.blockNumber}`);
    } else {
      console.error(`\n❌ Transaction failed. Status: ${receipt.status}`);
    }
  } catch (error: any) {
    console.error("\n❗ An error occurred while casting your vote:", error.message || error);
    process.exitCode = 1;
  }
}

/**
 * Entry point of the script.
 * Expects two command-line arguments:
 * 1. Contract Address
 * 2. Proposal Index (0, 1, or 2)
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("⚠️  Usage: ts-node scripts/Vote.ts <ContractAddress> <ProposalIndex>");
    process.exit(1);
  }

  const [contractAddressInput, proposalIndexInput] = args;

  // Validate Ethereum address
  const isValidAddress = (address: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(address);

  if (!isValidAddress(contractAddressInput)) {
    console.error("⚠️  Invalid Contract Address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters).");
    process.exit(1);
  }

  // Validate Proposal Index
  const proposalIndex = Number(proposalIndexInput);
  if (!Number.isInteger(proposalIndex) || proposalIndex < 0 || proposalIndex > 2) {
    console.error("⚠️  Invalid Proposal Index. Must be an integer: 0, 1, or 2.");
    process.exit(1);
  }

  const contractAddress = contractAddressInput as Address;

  await castVote(contractAddress, proposalIndex);
}

main().catch((error) => {
  console.error("❗ Script execution failed:", error);
  process.exitCode = 1;
});

export { main as vote };
