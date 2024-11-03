import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { hexToString } from "viem";
import * as dotenv from "dotenv";
dotenv.config();
import { publicClient, deployerClient } from "./config";

async function main() {
    console.log("Query script started with parameters: contract address");
    // Get arguments from the command line arguments
    const args = process.argv.slice(2);
    if (!args || args.length < 1)
    throw new Error("Parameters not provided");

    // Get contract address from arguments
    const contractAddress = args[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

    try {
        // Get the winning proposal index
        const winningProposalIndex = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "winningProposal",
        });
        
        // Get the winner name
        const winner = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "winnerName",
        }) as `0x${string}`;

        // convert winner name to string
        const winnerNameString = Buffer.from(winner.slice(2), 'hex')
            .toString()
            .replace(/\0/g, ''); // Remove null characters

        // check if the winner proposal has votes
        const proposal = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "proposals",
            args: [winningProposalIndex],
        }) as [ string, bigint ];
        const voteCount = Number(proposal[1]);

        // print the result
        if (voteCount > 0) {
            console.log("The winner is:", winnerNameString, "with proposal index:", Number(winningProposalIndex), " with ", voteCount, " votes.");
        } else {
            console.log("there is no vote on any proposal yet");
        }
        process.exit(0);
    } catch (error: any) {
        console.log(error.shortMessage || "An error occurred");
        process.exit(1);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
