// ts-node scripts/GiveRights.ts <contract-address> <voter-address>

import { createPublicClient, http, createWalletClient } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  // Parse command line arguments
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  const voterAddress = parameters[1] as `0x${string}`;
  
  // Validate inputs
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  if (!voterAddress) throw new Error("Voter address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
    throw new Error("Invalid voter address");

  // Create clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const chairperson = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  console.log("Giving right to vote to:", voterAddress);
  console.log("Confirm? (Y/n)");

  const stdin = process.stdin;
  stdin.addListener("data", async function (d: Buffer) {
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await chairperson.writeContract({
        address: contractAddress,
        abi,
        functionName: "giveRightToVote",
        args: [voterAddress],
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