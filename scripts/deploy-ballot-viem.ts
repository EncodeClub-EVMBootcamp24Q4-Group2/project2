// https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-08#creating-a-public-client
// https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-08?tab=readme-ov-file#creating-a-wallet-client


// deployed address 1:  0xfd00178690757b3a8da935f932b6fd1804f38264
// deployed address 2: 0x92620b62e21193ed7a0f36915522efab5049a718

// npx ts-node --files ./scripts/deploy-ballot-viem.ts "pizza" "salad" "lamb chops"

// import { createPublicClient, http } from "viem";
// import dependencies: public client, wallet client, conversion tools
import { 
	createPublicClient, 
	http, 
	createWalletClient, 
	formatEther, 
	toHex, 
	hexToString,  
} from "viem"; 

import { privateKeyToAccount } from "viem/accounts"; //wallet client

// Import abi and bytecode from your compiled contract json artifact
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";

import { sepolia } from "viem/chains";
import 'dotenv/config' 

// NB:  In TS, "||"" cannot be used when assigning booleans, numbers, etc.
	//see: https://stackoverflow.com/a/60353941/946957
const providerApiKey     = process.env.ALCHEMY_API_KEY || "";  
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

// const ETH_SEPOLIA_RPC_URL_1 = process.env.ETH_SEPOLIA_RPC_URL_1
// const ETH_SEPOLIA_RPC_URL_2 = process.env.ETH_SEPOLIA_RPC_URL_2


async function main() {

	// 1. custom code for Ballot.sol
  	const proposals = process.argv.slice(2); // CLI args are auto-converted to 0-indexed array.  First 2 indices are metadata
	if (!proposals || proposals.length < 1) {
    	throw new Error("Proposals not provided");
	}

	// 2a. Instantiate publicClient
	const publicClient = createPublicClient({
		chain: sepolia,
		transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
	});

	// 2b. Output chain info using publicClient
	const blockNumber = await publicClient.getBlockNumber(); // test public client
	console.log("Last block number:", blockNumber);	// test public client

	// 3. Instantiate  wallet client
	const account = privateKeyToAccount(`0x${deployerPrivateKey}`); // wallet client
	const deployer = createWalletClient({ //wallet client
		account,
		chain: sepolia,
		transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
	});
	
	// 4. Output wallet client infos:
	console.log("Deployer address:", deployer.account.address);

		const balance = await publicClient.getBalance({
			address: deployer.account.address,
		});

	console.log( "Deployer balance:",
		formatEther(balance),
		deployer.chain.nativeCurrency.symbol
	)


	// 5. Deploy Contract: https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-08?tab=readme-ov-file#deploying-a-contract
	console.log("\nDeploying Ballot contract");

	const hash = await deployer.deployContract({
		abi,
		bytecode: bytecode as `0x${string}`, // hexadecimal string, which is the standard format for Ethereum bytecode.

		//convers "pizza", "salad", "lamb chops" to: ["0x70697a7a61000000000000000000000000000000000000000000000000000000", "0x73616c6164000000000000000000000000000000000000000000000000000000", "0x6c616d622063686f707300000000000000000000000000000000000000000000" ]
		args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
	});

	console.log("Transaction hash:", hash);
	console.log("Waiting for confirmations...");
	const receipt = await publicClient.waitForTransactionReceipt({ hash });
	console.log("Ballot contract deployed to:", receipt.contractAddress);
	//new
	//const contractAddress = receipt.contractAddress;


	// 6. Reading information from a deployed contract
	console.log("Proposals: ");

	// Use readContract function from a Public Client
	// Use the same ABI as used before to create a contract instance
	for (let index = 0; index < proposals.length; index++) {

		const proposal = (await publicClient.readContract({
			address: receipt.contractAddress as `0x${string}`, //receipt.contractAddress,
			abi,
			functionName: "proposals",
			args: [BigInt(index)],
		})) as any[];
		
		const name = hexToString(proposal[0], { size: 32 });
		console.log({ index, name, proposal });
	}


}


// Use below pattern to be able to use async/await everywhere and properly handle errors.

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
