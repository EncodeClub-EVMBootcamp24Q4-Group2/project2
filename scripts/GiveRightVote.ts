import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
      throw new Error("Proposals not provided");
    const contractAddress = parameters[0] as `0x${string}`;
    const voterAddress = parameters[1] as `0x${string}`;

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

    let giveRightToVoteHash = await walletClient.writeContract({
        abi: abi,
        address: contractAddress,
        functionName: "giveRightToVote",
        args:[ voterAddress ]
    });

   
	let transaction = await publicClient.waitForTransactionReceipt({ hash: giveRightToVoteHash });
    console.log("Transaction hash:", giveRightToVoteHash);
	console.log("Below is the receipt object for voter: ", voterAddress);
    console.log("Transaction object: ", transaction);
    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});