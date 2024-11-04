# Homework #2

# Sample Hardhat Project

## CastVote Results

### Proposal Details
- **Name:** lamb chops
- **Current vote count:** `1n`

### Transaction Information
**Voting address:** `0xA277dae5d2EbF93F589f31E8E6a7f5608895E0B3`  
**Proposal:** lamb chops  
**Confirmation:** `y`

### Transaction Details
**Hash:** `0xb1fbc0423e2a06f032f031038e61eb9ed6cec4e7738e45cbef905e9e19e72751`  
**Status:** Transaction confirmed

### Transaction Receipt
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
```

## Contract Deployment With Viem

### Deployment Information
- **Last block number:** 7008002n
- **Deployer address:** 0xA277dae5d2EbF93F589f31E8E6a7f5608895E0B3
- **Deployer balance:** 0.078934718291314438 ETH

### Deployment Details
- **Transaction hash:** 0x2f48b75eba926e961e8048f469cc187e659c10a6103adbd8d6a0e4183e68dc5c
- **Contract address:** 0x5912b7eb86ee25ea1a60bde6c7f554c6130f7ac0

### Proposals
1. **Watermelon**
   ```json
   {
     "index": 0,
     "name": "Watermelon",
     "proposal": [
       "0x57617465726d656c6f6e00000000000000000000000000000000000000000000",
       "0n"
     ]
   }
   ```

2. **Lime**
   ```json
   {
     "index": 1,
     "name": "Lime",
     "proposal": [
       "0x4c696d6500000000000000000000000000000000000000000000000000000000",
       "0n"
     ]
   }
   ```

3. **Lemon**
   ```json
   {
     "index": 2,
     "name": "Lemon",
     "proposal": [
       "0x4c656d6f6e000000000000000000000000000000000000000000000000000000",
       "0n"
     ]
   }
   ```

## Give Voting Rights

### Transaction Information
**Contract Address:** `0x5912b7eb86ee25ea1a60bde6c7f554c6130f7ac0`  
**Voter Address:** `0xb3C1cd1ab988294747fb0049A567A83ff64cd625`  
**Confirmation:** `y`

### Transaction Details
**Hash:** `0xdfda1c0a7aee56e60bdaadcd034b37f2b6b34701a3874585c01d8d6ecb99e948`  
**Status:** Transaction confirmed

### Transaction Receipt
```json
{
  "blockHash": "0xb1ea4be8554937950709346dd08ba12e50c239a7cbf72bf369f1c3d1fd5f8232",
  "blockNumber": "7008067n",
  "contractAddress": null,
  "cumulativeGasUsed": "14148639n",
  "effectiveGasPrice": "4983609360n",
  "from": "0xa277dae5d2ebf93f589f31e8e6a7f5608895e0b3",
  "gasUsed": "48645n",
  "logs": [],
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "status": "success",
  "to": "0x5912b7eb86ee25ea1a60bde6c7f554c6130f7ac0",
  "transactionHash": "0xdfda1c0a7aee56e60bdaadcd034b37f2b6b34701a3874585c01d8d6ecb99e948",
  "transactionIndex": 70,
  "type": "eip1559"
}
```

### Voting Rights Confirmation
#### Proposal Details
- **Name:** Lime
- **Current vote count:** `0n`

#### Transaction Information
**Voting address:** `0xb3C1cd1ab988294747fb0049A567A83ff64cd625`  
**Proposal:** Lime  
**Confirmation:** `y`

#### Transaction Details
**Hash:** `0xc0856fefa99ea139e65f15ac021caf4d09175e3ca09c426e9bf6a830baa6532e`  
**Status:** Transaction confirmed

#### Transaction Receipt
```json
{
  "blockHash": "0xc8e0a37a0e1812e6eab2e21c081ce9766be5c13484afec94a275dd95ae978304",
  "blockNumber": "7008091n",
  "contractAddress": null,
  "cumulativeGasUsed": "8642391n",
  "effectiveGasPrice": "4709650608n",
  "from": "0xb3c1cd1ab988294747fb0049a567a83ff64cd625",
  "gasUsed": "92915n",
  "logs": [],
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "status": "success",
  "to": "0x5912b7eb86ee25ea1a60bde6c7f554c6130f7ac0",
  "transactionHash": "0xc0856fefa99ea139e65f15ac021caf4d09175e3ca09c426e9bf6a830baa6532e",
  "transactionIndex": 60,
  "type": "eip1559"
}
```

## Get Results

### Contract Query
**Contract Address:** `0x92620b62E21193ed7A0f36915522EFab5049A718`

### Current Standings
🏆 **Final Vote Count:**
- **salad:** 2 votes (Winner)
- **lamb chops:** 2 votes
- **pizza:** 0 votes

### Winning Proposal
- **Name:** salad
- **Index:** 1
- **Votes:** 2

## Usage Instructions

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

### Available Tasks

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```