import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["proposal 1", "proposal 2", "proposal 3"];
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.encodeBytes32String(array[index]));
  }
  return bytes32Array;
}

async function deployContract() {
  const ballotFactory = await ethers.getContractFactory("Ballot");
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS)
  );
  await ballotContract.waitForDeployment();
  return ballotContract;
}
describe("Ballot", async () => {
  let ballotContract: Ballot;
  describe("when the contract", async () => {
    beforeEach(async () => {
      ballotContract = await loadFixture(deployContract);
    });
    it("has the provided proposals", async () => {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.decodeBytes32String(proposal.name)).to.equal(
          PROPOSALS[index]
        );
      }
    });
    it("has zero votes for all proposals", async () => {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.equal("0");
      }
    });
    it("should set deployer address as chairperson", async () => {
      const accounts = await ethers.getSigners();
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(accounts[0].address); // because we are using hardhat, the first address is the deployer.
    });
  });
});
