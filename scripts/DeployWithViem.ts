import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString } from "viem";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  //////////////////////
  //Create Public Client
  //////////////////////  
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  //////////////////////
  //Create a Wallet Client
  ///////////////////////
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  /////////////////////
  //Deploying a Contract
  //////////////////////
  console.log("\nDeploying Ballot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) throw new Error("No contract address in receipt");
  const contractAddress = receipt.contractAddress as `0x${string}`;
  console.log("Ballot contract deployed to:", contractAddress);


 ///////////////////
 //Read Contract
 //////////////////
  console.log("Proposals: ");
  for (let index = 0; index < proposals.length; index++) {
    const proposal = (await publicClient.readContract({
      address: contractAddress,
      abi,
      functionName: "proposals",
      args: [BigInt(index)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});