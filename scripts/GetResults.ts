// ts-node scripts/GetResults.ts <contract-address>


import { createPublicClient, http, hexToString } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {
  // Parse command line arguments
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Contract address not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  
  // Validate contract address
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  // Create public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Get winning proposal
  const winningProposalIndex = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winningProposal",
  });

  const winnerName = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winnerName",
  });

  // Get the total number of proposals
  let index = 0;
  const proposals = [];
  
  console.log("\n🗳️ Ballot Results 🗳️\n");
  
  // Fetch all proposals
  while (true) {
    try {
      const proposal = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "proposals",
        args: [BigInt(index)],
      }) as any[];

      const name = hexToString(proposal[0], { size: 32 });
      const voteCount = Number(proposal[1]);
      
      proposals.push({ index, name, voteCount });
      index++;
    } catch (error) {
      // When we hit an error, we've gone past the last proposal
      break;
    }
  }

  // Sort proposals by vote count in descending order
  proposals.sort((a, b) => b.voteCount - a.voteCount);

  // Display results
  console.log("📊 Current Standings:");
  console.log("-------------------");
  proposals.forEach((proposal) => {
    const isWinner = proposal.index === Number(winningProposalIndex);
    console.log(
      `${isWinner ? "🏆 " : "   "}${proposal.name}: ${proposal.voteCount} votes${
        isWinner ? " (Winner)" : ""
      }`
    );
  });

  console.log("\n🏆 Winning Proposal:");
  console.log("-------------------");
  console.log("Name:", hexToString(winnerName as `0x${string}`, { size: 32 }));
  console.log("Index:", Number(winningProposalIndex));
  console.log(
    "Votes:",
    proposals.find((p) => p.index === Number(winningProposalIndex))?.voteCount ?? 0
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});