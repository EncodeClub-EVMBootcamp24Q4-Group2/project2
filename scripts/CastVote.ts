//ts-node scripts/CastVote.ts <contract-address> <proposal-index>

// This script needs two arguments: the contract's address and which proposal to vote for (by index)
import { createPublicClient, http, createWalletClient, hexToString } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

// Get API key and private key from environment variables
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const voterPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  // Get the contract address and proposal number from command line arguments
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  const proposalIndex = parameters[1];

  // Make sure we have valid inputs
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

  // Set up a client that can read from the blockchain
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Create an account from our private key and set up a client that can write to the blockchain
  const account = privateKeyToAccount(`0x${voterPrivateKey}`);
  const voter = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Get information about the proposal we're voting for
  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(proposalIndex)],
  })) as any[];
  
  // Convert the proposal name from bytes32 to readable text
  const proposalName = hexToString(proposal[0], { size: 32 });
  
  // Show the proposal details before voting
  console.log("\nProposal details:");
  console.log("Name:", proposalName);
  console.log("Current vote count:", proposal[1]);
  
  // Show who's voting and ask for confirmation
  console.log("\nVoting from address:", voter.account.address);
  console.log("Confirm vote for proposal:", proposalName);
  console.log("Confirm? (Y/n)");

  // Listen for user input
  const stdin = process.stdin;
  stdin.addListener("data", async function (d: Buffer) {
    // If user doesn't type 'n', proceed with voting
    if (d.toString().trim().toLowerCase() != "n") {
      // Call the smart contract function to cast our vote
      const hash = await voter.writeContract({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [BigInt(proposalIndex)],
      });
      
      // Wait for the transaction to be confirmed on the blockchain
      console.log("Transaction hash:", hash);
      console.log("Waiting for confirmations...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed");
      console.log(receipt);
    } else {
      console.log("Operation cancelled");
    }
    process.exit();
  });
}

// Run the main function and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});