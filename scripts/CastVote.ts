//ts-node scripts/CastVote.ts <contract-address> <proposal-index>

import { createPublicClient, http, createWalletClient, hexToString } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const voterPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  // Parse command line arguments
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  const proposalIndex = parameters[1];

  // Validate inputs
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

  // Create clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const account = privateKeyToAccount(`0x${voterPrivateKey}`);
  const voter = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Get proposal details before voting
  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(proposalIndex)],
  })) as any[];
  
  const proposalName = hexToString(proposal[0], { size: 32 });
  console.log("\nProposal details:");
  console.log("Name:", proposalName);
  console.log("Current vote count:", proposal[1]);
  
  console.log("\nVoting from address:", voter.account.address);
  console.log("Confirm vote for proposal:", proposalName);
  console.log("Confirm? (Y/n)");

  const stdin = process.stdin;
  stdin.addListener("data", async function (d: Buffer) {
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await voter.writeContract({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [BigInt(proposalIndex)],
      });
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});