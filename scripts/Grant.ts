import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();
import { publicClient, deployerClient } from "./config";

async function main() {
    console.log("GrantRight script started with parameters: contract address, voter address");
    // Get arguments from the command line arguments
    const args = process.argv.slice(2);
    if (!args || args.length < 2)
      throw new Error("Parameters not provided");

    // Get contract address from arguments
    const contractAddress = args[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
      throw new Error("Invalid contract address");

    // Get voter address from the arguments
    const voterAddress = args[1] as `0x${string}`;
    if (!voterAddress) throw new Error("Voter address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress)) 
        throw new Error("Invalid voter address format. Must be a valid Ethereum address (0x followed by 40 hexadecimal characters)");

    // check if voter is deployer
    if (voterAddress === deployerClient.account.address) {
        console.log("chairperson cannot grant voting rights to themselves");
        process.exit(1);
    }

    const voter = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "voters",
        args: [voterAddress],
    }) as any;
    const [ weight ] = voter
    console.log("\nVoter Status:");
    console.log("Address:", voterAddress);
    if (weight === 0n) {
        console.log("This address has no voting rights. Grant voting rights? (y/n)");
    } else {
        console.log("\nError: This address already has voting rights.");
        process.exit(1);
    }

    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    stdin.addListener("data", async function (d) {
        try {
            if (d.toString().trim().toLowerCase() == "y") {
                const hash = await deployerClient.writeContract({
                address: contractAddress,
                abi,
                functionName: "giveRightToVote",
                args: [voterAddress],
                });
                console.log("Transaction hash:", hash);
                console.log("Waiting for confirmations...");
                const receipt = await publicClient.waitForTransactionReceipt({ hash });
                console.log("Voting right granted to", voterAddress, "status:", receipt.status);
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