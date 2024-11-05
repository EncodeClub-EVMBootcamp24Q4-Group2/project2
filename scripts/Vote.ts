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

const proposal = ( await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(0)],
})) as any[];

	console.log("proposal: ", hexToString(proposal[0], { size: 32 }));
    
 const voteHash = await walletClient.writeContract({
    abi: abi,
    address: contractAddress!,
    functionName: "vote",
    args:[BigInt(0)]  
});


	console.log("Waiting for confirmations...");
	let result = await publicClient.waitForTransactionReceipt({ hash: voteHash });
    console.log("Transaction hash:", voteHash);
	console.log("Voted for ", result.from );

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});