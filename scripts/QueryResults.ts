import { Address } from "viem";
import { publicClient } from "./config";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

/**
 * Function to read voter addresses from a JSON file.
 * @param filePath - The path to the JSON file containing voter addresses.
 * @returns An array of Ethereum addresses.
 */
function readVoterAddresses(filePath: string): Address[] {
  try {
    const absolutePath = path.resolve(__dirname, filePath);
    const data = fs.readFileSync(absolutePath, "utf-8");
    const addresses: string[] = JSON.parse(data);

    // Validate each address
    const isValidAddress = (address: string): boolean =>
      /^0x[a-fA-F0-9]{40}$/.test(address);

    const validAddresses: Address[] = [];

    addresses.forEach((address, index) => {
      if (isValidAddress(address)) {
        validAddresses.push(address as Address);
      } else {
        console.warn(`⚠️  Invalid address format at index ${index}: ${address}`);
      }
    });

    return validAddresses;
  } catch (error) {
    console.error("❗ Failed to read voter addresses:", error);
    process.exit(1);
  }
}

/**
 * Function to query and display voting results.
 * @param contractAddress - The address of the deployed Ballot contract.
 * @param voterAddresses - An array of voter wallet addresses to query.
 */
async function queryVotingResults(contractAddress: Address, voterAddresses: Address[]) {
  console.log(`\n📊 Querying Voting Results for Contract: ${contractAddress}\n`);

  console.log(`Total Voters to Query: ${voterAddresses.length}\n`);

  // Header for the results table
  console.log(`Voter Address                           || Voted Proposal Index`);
  console.log(`---------------------------------------------------------------`);

  for (const voter of voterAddresses) {
    try {
      const voterData = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "voters",
        args: [voter],
      }) as any;

      const [weight, voted, delegate, vote] = voterData;

      if (voted) {
        console.log(`${voter} || ${vote.toString()}`);
      }
      // If the voter hasn't voted, you can choose to display it or skip
      // To display all voters with their voting status, uncomment the following lines:
      /*
      else {
        console.log(`${voter} || Not Voted`);
      }
      */
    } catch (error: any) {
      console.error(`❌ Error querying voter ${voter}:`, error.message || error);
    }
  }

  console.log(`\n📈 Voting Results Query Completed.\n`);
}

/**
 * Entry point of the script.
 * Expects two command-line arguments:
 * 1. Contract Address
 * 2. Path to the JSON file containing voter addresses
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("⚠️  Usage: ts-node scripts/QueryVotingResults.ts <ContractAddress> <VotersJsonFilePath>");
    console.error("⚠️  Example: ts-node scripts/QueryVotingResults.ts 0xYourContractAddress voters.json");
    process.exit(1);
  }

  const [contractAddressInput, votersFilePath] = args;

  // Validate Ethereum contract address
  const isValidAddress = (address: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(address);

  if (!isValidAddress(contractAddressInput)) {
    console.error("⚠️  Invalid Contract Address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters).");
    process.exit(1);
  }

  const contractAddress = contractAddressInput as Address;

  // Read voter addresses from the specified JSON file
  const voterAddresses = readVoterAddresses(votersFilePath);

  if (voterAddresses.length === 0) {
    console.log("ℹ️  No valid voter addresses found to query.");
    process.exit(0);
  }

  await queryVotingResults(contractAddress, voterAddresses);
}

main().catch((error) => {
  console.error("❗ Script execution failed:", error);
  process.exitCode = 1;
});

export { main as queryVotingResults };
