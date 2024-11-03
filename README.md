# Encode Club EVM Bootcamp, Q4 2024, Group 2, Homework #2

## Summary
This project represents Homework #2 for Group #2 for the Encode Club EVM Bootcamp.  The assignment is defined as:
* Develop and run scripts for “Ballot.sol” within your group to give voting rights, casting votes, delegating votes and querying results
* Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed

This Branch is specific to changes that Brian Blank made and tested.

## Install Instructions

```
git clone https://github.com/EncodeClub-EVMBootcamp24Q4-Group2/project2.git --branch=brianblank
npm install
npm install --save-dev hardhat
npm install --save-dev mocha
npx hardhat compile
```

Be sure to also create a .env file with the following fields.
```
PRIVATE_KEY="..."
ALCHEMY_API_KEY="..."
```


## Group Contribution

Our group instantiated a Ballot.sol script at [address 0x92620b62E21193ed7A0f36915522EFab5049A718](https://sepolia.etherscan.io/address/0x92620b62E21193ed7A0f36915522EFab5049A718).

I voted for "lamb chops" as follows.

```
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ npx ts-node --files ./scripts/4CastVoteWithViem.ts 0x92620b62E21193ed7A0f36915522EFab5049A718 "lamb chops"
Cast your Vote
Wallet address: 0xe429F5E3A91b4932aE3022de3E3Ca0F6A911eECa
Contract address: 0x92620b62E21193ed7A0f36915522EFab5049A718
Proposal: lamb chops
Proposal index: 2
Do you want to cast this vote? (Y/n)
Y
Transaction hash: 0x1647129dc766ea38aa06f56c20efbcda97ba7b54758917f6a6bdf9f201fc4fcb
Waiting for confirmations...
Transaction confirmed
```
The transaction details can be viewed with [hash 0x1647129dc766ea38aa06f56c20efbcda97ba7b54758917f6a6bdf9f201fc4fcb](https://sepolia.etherscan.io/tx/0x1647129dc766ea38aa06f56c20efbcda97ba7b54758917f6a6bdf9f201fc4fcb)

## Validation of all Scripts

To Validate all test scripts, I created a separate instantiation of Ballot.sol at [address 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85](https://sepolia.etherscan.io/address/0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85).

### 1. Install Ballot.sol using viem

```
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ npx ts-node --files ./scripts/1DeployWithViem.ts "Italian" "Japanese" "Greek" "Spanish"
Last block number: 7006074n
Deployer address: 0xb3C1cd1ab988294747fb0049A567A83ff64cd625
Deployer balance: 0.24847177604264366 ETH

Deploying Ballot contract
Transaction hash: 0xf954ee74bedf8bfcd877c50f6e58289cd7eae51c73772138ebf8e7a0d32b434f
Waiting for confirmations...
Ballot contract deployed to: 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85
Proposals: 
{
  index: 0,
  name: 'Italian',
  proposal: [
    '0x4974616c69616e00000000000000000000000000000000000000000000000000',
    0n
  ]
}
{
  index: 1,
  name: 'Japanese',
  proposal: [
    '0x4a6170616e657365000000000000000000000000000000000000000000000000',
    0n
  ]
}
{
  index: 2,
  name: 'Greek',
  proposal: [
    '0x477265656b000000000000000000000000000000000000000000000000000000',
    0n
  ]
}
{
  index: 3,
  name: 'Spanish',
  proposal: [
    '0x5370616e69736800000000000000000000000000000000000000000000000000',
    0n
  ]
}
```

The contract was installed at [address 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85](https://sepolia.etherscan.io/address/0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85).

### 2. Giving Voting Rights

I gave voting rights to two address as shown below.  The first address will delegates it's rights to the second address in the next step.

**VOTER1**
```
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ npx ts-node --files ./scripts/2GiveRightToVoteWithViem.ts 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85 0xe429F5E3A91b4932aE3022de3E3Ca0F6A91
1eECa
Give right to vote to a voter
Wallet address: 0xb3C1cd1ab988294747fb0049A567A83ff64cd625
Contract address: 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85
Voter address: 0xe429F5E3A91b4932aE3022de3E3Ca0F6A911eECa
Do you want to assign the right to vote to this voter? (Y/n)
Y
Transaction hash: 0x29e8636f703fa768de32167586ed91a6b4e9d4ffa8f809399e87bf6a58e54357
Waiting for confirmations...
Transaction confirmed
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ 
```

**VOTER 2**
```
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ npx ts-node --files ./scripts/2GiveRightToVoteWithViem.ts 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85 0x3559f67e10B40eF699D520DC893A872953d92569
Give right to vote to a voter
Wallet address: 0xb3C1cd1ab988294747fb0049A567A83ff64cd625
Contract address: 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85
Voter address: 0x3559f67e10B40eF699D520DC893A872953d92569
Do you want to assign the right to vote to this voter? (Y/n)
Y
Transaction hash: 0xf3e16c9ad08bd5f319a1056933e585f0e49dd942377595a2377b1b376ac64345
Waiting for confirmations...
Transaction confirmed
```

Transactions can be found at 
* [Address 0x29e8636f703fa768de32167586ed91a6b4e9d4ffa8f809399e87bf6a58e54357](https://sepolia.etherscan.io/tx/0x29e8636f703fa768de32167586ed91a6b4e9d4ffa8f809399e87bf6a58e54357)
* [Address 0xf3e16c9ad08bd5f319a1056933e585f0e49dd942377595a2377b1b376ac64345](https://sepolia.etherscan.io/tx/0xf3e16c9ad08bd5f319a1056933e585f0e49dd942377595a2377b1b376ac64345)

## 3. Delegate Vote using Viem

The first voting address will delegate it's voting rights to the second voting address.

```
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ npx ts-node --files ./scripts/3DelegateVoteWithViem.ts 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85 0x3559f67e10B40eF699D520DC893A872953d92569
Delegate vote to another voter
Wallet address: 0xe429F5E3A91b4932aE3022de3E3Ca0F6A911eECa
Contract address: 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85
Delegate address: 0x3559f67e10B40eF699D520DC893A872953d92569
Do you want to assign this delegate for your vote? (Y/n)
Y
Transaction hash: 0x5f6ceed9e3ad666b9efd61916f2b98bdb8a6f37efe9caffd0e9842520663a0c5
Waiting for confirmations...
Transaction confirmed
```
Transaction details can be found at  [Address 0x5f6ceed9e3ad666b9efd61916f2b98bdb8a6f37efe9caffd0e9842520663a0c5](https://sepolia.etherscan.io/tx/0x5f6ceed9e3ad666b9efd61916f2b98bdb8a6f37efe9caffd0e9842520663a0c5)

### 4. Cast Vote using Viem

I then cast my vote using the second wallet address for "Japanese".  Note that the parameter to the .ts script is the word rather than the index number.  The script then looks up the proper index number.

```
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ npx ts-node --files ./scripts/4CastVoteWithViem.ts 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85 "Japanese"
Cast your Vote
Wallet address: 0x3559f67e10B40eF699D520DC893A872953d92569
Contract address: 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85
Proposal: Japanese
Proposal index: 1
Do you want to cast this vote? (Y/n)
Y
Transaction hash: 0x1350f32d8d5170cef15b6d6a0b2a13fb8d15b8d729bca70bfd6aa0a6d59516d1
Waiting for confirmations...
Transaction confirmed
```
Transaction details can be found at  [Address 0x1350f32d8d5170cef15b6d6a0b2a13fb8d15b8d729bca70bfd6aa0a6d59516d1](https://sepolia.etherscan.io/tx/0x1350f32d8d5170cef15b6d6a0b2a13fb8d15b8d729bca70bfd6aa0a6d59516d1)

### 5. Finally I tally the results and get the winning selection

```
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ npx ts-node --files ./scripts/5GetWinnerNameWithViem.ts 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85
Get winning vote
Contract address: 0x5bede9212f0d69ace11d0ee7bc31b6a0be2d1f85
Proposals with Count of Votes:
{ proposalIndex: 0, name: 'Italian', voteCount: 0n }
{ proposalIndex: 1, name: 'Japanese', voteCount: 2n }
{ proposalIndex: 2, name: 'Greek', voteCount: 0n }
{ proposalIndex: 3, name: 'Spanish', voteCount: 0n }
Winner Name: Japanese
```


## Testing of Ballot.sol using Hardhat test scripts

I also completed the test/Ballot.ts script and validated all of the test cases.

```
brian@OfficePCWin11:~/dev/encodeclub/evmbootcamp/project2$ npx hardhat test


  Ballot
    when the contract is deployed
Ballot contract deployed at: 0x5fbdb2315678afecb367f032d93f642f64180aa3
Bytes32 proposals:
         0x50726f706f73616c203100000000000000000000000000000000000000000000
         0x50726f706f73616c203200000000000000000000000000000000000000000000
         0x50726f706f73616c203300000000000000000000000000000000000000000000
      ✔ has the provided proposals (1409ms)
      ✔ has zero votes for all proposals
      ✔ sets the deployer address as chairperson
      ✔ sets the voting weight for the chairperson as 1
    when the chairperson interacts with the giveRightToVote function in the contract
      ✔ gives right to vote for another address
      ✔ can not give right to vote for someone that has voted
      ✔ can not give right to vote for someone that has already voting rights
    when the voter interacts with the vote function in the contract
      ✔ should register the vote
    when the voter interacts with the delegate function in the contract
      ✔ should transfer voting power
    when an account other than the chairperson interacts with the giveRightToVote function in the contract
      ✔ should revert
    when an account without right to vote interacts with the vote function in the contract
      ✔ should revert
    when an account without right to vote interacts with the delegate function in the contract
      ✔ should revert
    when someone interacts with the winningProposal function after one vote is cast for the first proposal
      ✔ should return 0
    when someone interacts with the winnerName function after one vote is cast for the first proposal
      ✔ should return name of proposal 0
    when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals
      ✔ should return the name of the winner proposal (39ms)


  15 passing (2s)
```
