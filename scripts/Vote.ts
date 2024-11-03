import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { hexToString } from "viem";
import * as dotenv from "dotenv";
dotenv.config();
import { publicClient, deployerClient } from "./config";

async function main() {
    console.log("CastVote script started with parameters: contract address, proposal index, voter address");
    // Get arguments from the command line arguments
    const args = process.argv.slice(2);
    if (!args || args.length < 2)
      throw new Error("Parameters not provided");

    // Get contract address from arguments
    const contractAddress = args[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
      throw new Error("Invalid contract address");

    // Get proposal index to vote for from arguments
    const proposalIndex = args[1];
    if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

    // Get voter address from the arguments
    const voterAddress = args[2] as `0x${string}`;
    if (!voterAddress) throw new Error("Voter address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress)) 
        throw new Error("Invalid voter address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)");

    // check if voter is deployer
    if (voterAddress === deployerClient.account.address) {
        console.log("voter is chairperson");
    }

    const voter = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "voters",
        args: [voterAddress],
    }) as any;
    const [weight, voted, delegate, vote] = voter
    console.log("\nVoter Status:");
    console.log("Address:", voterAddress);
    if (weight === 0n) {
        console.log("\nError: This address has no voting rights.");
        console.log("The chairperson must grant voting rights before this address can vote.");
        process.exit(1);
    } else {
        console.log("Weight:", weight.toString());
        if (voted) {
            console.log("Delegated to:", delegate);
            console.log("Voted for proposal:", vote.toString());
            process.exit(1);
        } else {
            console.log("Voted for proposal: None");
        }
    }

    console.log("Proposal selected: ");
    const proposal = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "proposals",
      args: [BigInt(proposalIndex)],
    })) as any[];
    if (!proposal) throw new Error("Proposal not found");

    const name = hexToString(proposal[0], { size: 32 });
    console.log("Voting to proposal", name);
    console.log("Confirm? (y/n)");

    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    stdin.addListener("data", async function (d) {
        try {
            if (d.toString().trim().toLowerCase() == "y") {
                const hash = await voter.address.writeContract({
                address: contractAddress,
                abi,
                functionName: "vote",
                args: [BigInt(proposalIndex)],
                });
                console.log("Transaction hash:", hash);
                console.log("Waiting for confirmations...");
                const receipt = await publicClient.waitForTransactionReceipt({ hash });
                console.log("Transaction confirmed ", receipt.status);
                process.exit(0);
            } else {
                console.log("Operation cancelled ");
                process.exit(0);
            }
        }  catch (error: any) {
            console.log(error.shortMessage || "An error occurred");
            process.exit(1);
        }
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
