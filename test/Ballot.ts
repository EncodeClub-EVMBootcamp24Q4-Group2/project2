import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContract() {
  const publicClient = await viem.getPublicClient();
  const [deployer, otherAccount, otherAccount2, otherAccount3, otherAccount4] = await viem.getWalletClients();
  const ballotContract = await viem.deployContract("Ballot", [
    PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
  ]);
  console.log("Ballot contract deployed at:", ballotContract.address);
  console.log("Bytes32 proposals:\n\t", PROPOSALS.map((prop) => toHex(prop, { size: 32 })).join("\n\t "));
  return { publicClient, deployer, otherAccount, otherAccount2, otherAccount3, otherAccount4, ballotContract };
}

describe("Ballot", async () => {
  describe("when the contract is deployed", async () => {
    it("has the provided proposals", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(hexToString(proposal[0], { size: 32 })).to.eq(PROPOSALS[index]);
      }
    });

    it("has zero votes for all proposals", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(proposal[1]).to.eq(0n);
      }
    });

    it("sets the deployer address as chairperson", async () => {
      const { ballotContract, deployer } = await loadFixture(deployContract);
      const chairperson = await ballotContract.read.chairperson();
      expect(chairperson.toLowerCase()).to.eq(deployer.account.address);
    });

    it("sets the voting weight for the chairperson as 1", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      const chairperson = await ballotContract.read.chairperson();
      const chairpersonVoter = await ballotContract.read.voters([chairperson]);
      expect(chairpersonVoter[0]).to.eq(1n);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("gives right to vote for another address", async () => {
      const { ballotContract, otherAccount } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([otherAccount.account.address]);
      const voter = await ballotContract.read.voters([otherAccount.account.address]);
      expect(voter[0]).to.eq(1n);
    });
    it("can not give right to vote for someone that has voted", async () => {
      const { ballotContract, otherAccount } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([otherAccount.account.address]);
      const ballotContractAsOtherAccount = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount } });
      const proposalIndex = Math.floor(Math.random() * PROPOSALS.length);
      await ballotContractAsOtherAccount.write.vote([BigInt(proposalIndex)]);
      await expect(ballotContract.write.giveRightToVote([otherAccount.account.address])).to.be.rejectedWith("The voter already voted");
    });
    it("can not give right to vote for someone that has already voting rights", async () => {
      const { ballotContract, otherAccount } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([otherAccount.account.address]);
      const voter = await ballotContract.read.voters([otherAccount.account.address]);
      await expect(ballotContract.write.giveRightToVote([otherAccount.account.address])).to.be.rejected;
    });
  });

  describe("when the voter interacts with the vote function in the contract", async () => {
    it("should register the vote", async () => {
      const { ballotContract, otherAccount } = await loadFixture(deployContract);
      const ballotContractAsOtherAccount = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount } });
      const proposalIndex = Math.floor(Math.random() * PROPOSALS.length);
      await expect(ballotContractAsOtherAccount.write.vote([BigInt(proposalIndex)])).to.be.rejectedWith("Has no right to vote");
    });
  });

  describe("when the voter interacts with the delegate function in the contract", async () => {
    it("should transfer voting power", async () => {
      const { ballotContract, otherAccount, otherAccount2 } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([otherAccount.account.address]);
      await ballotContract.write.giveRightToVote([otherAccount2.account.address]);
      const ballotContractAsOtherAccount = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount } });
      await ballotContractAsOtherAccount.write.delegate([otherAccount2.account.address]);
      const otherAccountVoter = await ballotContract.read.voters([otherAccount.account.address]);
      expect(otherAccountVoter[2].toLowerCase()).to.eq(otherAccount2.account.address.toLowerCase());
    });
  });

  describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, otherAccount } = await loadFixture(deployContract);
      const ballotContractAsOtherAccount = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount } });
      await expect(ballotContractAsOtherAccount.write.giveRightToVote([otherAccount.account.address])).to.be.rejectedWith("Only chairperson can give right to vote");
    });
  });

  describe("when an account without right to vote interacts with the vote function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, otherAccount } = await loadFixture(deployContract);
      const ballotContractAsOtherAccount = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount } });
      const proposalIndex = Math.floor(Math.random() * PROPOSALS.length);
      await expect(ballotContractAsOtherAccount.write.vote([BigInt(proposalIndex)])).to.be.rejectedWith("Has no right to vote");
    });
  });

  describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, otherAccount, otherAccount2 } = await loadFixture(deployContract);
      const ballotContractAsOtherAccount = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount } });
      await expect(ballotContractAsOtherAccount.write.delegate([otherAccount2.account.address])).to.be.rejectedWith("You have no right to vote");
    });
  });

  describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
    it("should return 0", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      await ballotContract.write.vote([0n]);
      expect(await ballotContract.read.winningProposal()).to.eq(0n);
    });
  });

  describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
    it("should return name of proposal 0", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      await ballotContract.write.vote([0n]);
      expect(await ballotContract.read.winnerName()).to.eq(toHex(PROPOSALS[0], { size: 32 }));
    });
  });

  describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
    it("should return the name of the winner proposal", async () => {
      const { ballotContract, otherAccount, otherAccount2, otherAccount3, otherAccount4 } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([otherAccount.account.address]);
      await ballotContract.write.giveRightToVote([otherAccount2.account.address]);
      await ballotContract.write.giveRightToVote([otherAccount3.account.address]);
      await ballotContract.write.giveRightToVote([otherAccount4.account.address]);
      const ballotContractAsOtherAccount = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount } });
      const ballotContractAsOtherAccount2 = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount2 } });
      const ballotContractAsOtherAccount3 = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount3 } });
      const ballotContractAsOtherAccount4 = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: otherAccount4 } });

      const votes = [0, 1, 1, 0, 1];
      await ballotContract.write.vote([BigInt(votes[0])]);
      await ballotContractAsOtherAccount.write.vote([BigInt(votes[1])]);
      await ballotContractAsOtherAccount2.write.vote([BigInt(votes[2])]);
      await ballotContractAsOtherAccount3.write.vote([BigInt(votes[3])]);
      await ballotContractAsOtherAccount4.write.vote([BigInt(votes[4])]);

      expect(await ballotContract.read.winningProposal()).to.eq(1n);
      expect(await ballotContract.read.winnerName()).to.eq(toHex(PROPOSALS[1], { size: 32 }));
    });
  });
});
