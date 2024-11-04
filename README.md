# Sample Hardhat Project

## CastVote
**Proposal details:**
- Name: lamb chops
- Current vote count: `1n`

**Voting from address:** `0xA277dae5d2EbF93F589f31E8E6a7f5608895E0B3`  
**Confirm vote for proposal:** lamb chops  
**Confirm?** (Y/n)  
`y`

**Transaction hash:** `0xb1fbc0423e2a06f032f031038e61eb9ed6cec4e7738e45cbef905e9e19e72751`  
**Waiting for confirmations...**  
**Transaction confirmed**

```json
{
  "blockHash": "0xc4bbc78388626593c853478c781b06a80e64948196a395f52857f51dc947b055",
  "blockNumber": "7007916n",
  "contractAddress": null,
  "cumulativeGasUsed": "14158793n",
  "effectiveGasPrice": "5076995344n",
  "from": "0xa277dae5d2ebf93f589f31e8e6a7f5608895e0b3",
  "gasUsed": "75419n",
  "logs": [],
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "status": "success",
  "to": "0x92620b62e21193ed7a0f36915522efab5049a718",
  "transactionHash": "0xb1fbc0423e2a06f032f031038e61eb9ed6cec4e7738e45cbef905e9e19e72751",
  "transactionIndex": 67,
  "type": "eip1559"
}



This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
