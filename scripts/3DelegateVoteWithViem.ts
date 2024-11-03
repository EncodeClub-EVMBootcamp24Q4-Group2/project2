// npx ts-node --files ./scripts/DeployWithViem.ts "arg1" "arg2" "arg3"

import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address } from "viem";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  console.log("Delegate vote to another voter");

  ///////////////////////////////////////////////////////
  // Creating a public client
  ///////////////////////////////////////////////////////
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  ///////////////////////////////////////////////////////
  // Creating a wallet client
  ///////////////////////////////////////////////////////
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Wallet address:", walletClient.account.address);

  ///////////////////////////////////////////////////////
  // Check if the parameters are provided
  ///////////////////////////////////////////////////////
  const parameters = process.argv.slice(2);
  // Check if sufficient parameters are provided
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  // Check if the contract address is provided
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  // Check if delegate address is provided
  const delegateAddress = parameters[1] as `0x${string}`;
  if (!delegateAddress) throw new Error("Delegate address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(delegateAddress))
    throw new Error("Invalid delegate address");

  console.log("Contract address:", contractAddress);
  console.log("Delegate address:", delegateAddress);

  ////////////////////////////////////////////////////////////
  // Sending transaction on user confirmation
  console.log("Do you want to assign this delegate for your vote? (Y/n)");
  const stdin = process.stdin;
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi,
        functionName: "delegate",
        args: [delegateAddress],
      });
      console.log("Transaction hash:", hash);
      console.log("Waiting for confirmations...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed");
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
