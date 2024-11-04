// ts-node scripts/GetResults.ts <contract-address>

// This script needs one argument: the contract's address
import { createPublicClient, http, hexToString } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

// Get the API key from environment variables
const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {
  // Get the contract address from command line arguments
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Contract address not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  
  // Make sure the address looks like a real Ethereum address
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  // Set up a client that can read from the blockchain
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Get the index of the winning proposal from the contract
  const winningProposalIndex = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winningProposal",
  });

  // Get the name of the winning proposal from the contract
  const winnerName = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winnerName",
  });

  // Prepare to fetch all proposals
  let index = 0;
  const proposals = [];
  
  console.log("\n🗳️ Ballot Results 🗳️\n");
  
  // Keep fetching proposals until we hit an error (which means we've reached the end)
  while (true) {
    try {
      // Get the proposal at the current index
      const proposal = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "proposals",
        args: [BigInt(index)],
      }) as any[];

      // Convert the name from bytes32 to readable text and get the vote count
      const name = hexToString(proposal[0], { size: 32 });
      const voteCount = Number(proposal[1]);
      
      // Save this proposal's info
      proposals.push({ index, name, voteCount });
      index++;
    } catch (error) {
      // When we hit an error, we've gone past the last proposal
      break;
    }
  }

  // Sort the proposals by number of votes (highest first)
  proposals.sort((a, b) => b.voteCount - a.voteCount);

  // Show all proposals and their vote counts
  console.log("📊 Current Standings:");
  console.log("-------------------");
  proposals.forEach((proposal) => {
    // Mark the winning proposal with a trophy emoji
    const isWinner = proposal.index === Number(winningProposalIndex);
    console.log(
      `${isWinner ? "🏆 " : "   "}${proposal.name}: ${proposal.voteCount} votes${
        isWinner ? " (Winner)" : ""
      }`
    );
  });

  // Show detailed information about the winning proposal
  console.log("\n🏆 Winning Proposal:");
  console.log("-------------------");
  console.log("Name:", hexToString(winnerName as `0x${string}`, { size: 32 }));
  console.log("Index:", Number(winningProposalIndex));
  console.log(
    "Votes:",
    proposals.find((p) => p.index === Number(winningProposalIndex))?.voteCount ?? 0
  );
}

// Run the main function and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});