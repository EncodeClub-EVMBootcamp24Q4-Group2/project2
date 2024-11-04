// ts-node scripts/DelegateVote.ts <contract-address> <delegate-address>

// This script needs two arguments: the contract's address and the address we want to delegate our votes to
import { createPublicClient, http, createWalletClient } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

// Get API key and private key from environment variables
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const delegatorPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  // Get the contract address and delegate address from command line arguments
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  const delegateAddress = parameters[1] as `0x${string}`;
  
  // Make sure both addresses look like real Ethereum addresses
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  if (!delegateAddress) throw new Error("Delegate address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(delegateAddress))
    throw new Error("Invalid delegate address");

  // Set up a client that can read from the blockchain
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Create an account from our private key and set up a client that can write to the blockchain
  const account = privateKeyToAccount(`0x${delegatorPrivateKey}`);
  const delegator = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Show who we're delegating to and ask for confirmation
  console.log("Delegating vote to:", delegateAddress);
  console.log("From address:", delegator.account.address);
  console.log("Confirm? (Y/n)");

  // Listen for user input
  const stdin = process.stdin;
  stdin.addListener("data", async function (d: Buffer) {
    // If user doesn't type 'n', proceed with delegation
    if (d.toString().trim().toLowerCase() != "n") {
      // Call the smart contract function to delegate our votes
      const hash = await delegator.writeContract({
        address: contractAddress,
        abi,
        functionName: "delegate",
        args: [delegateAddress],
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