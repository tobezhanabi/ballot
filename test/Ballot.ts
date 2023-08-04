import { expect } from "chai";
import { ethers } from "hardhat";
const PROPOSALS = ["proposal 1", "proposal 2", "proposal 3"];
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.encodeBytes32String(array[index]));
  }
  return bytes32Array;
}
describe("Ballot", async () => {
  describe("when the contract", async () => {
    it("should set deployer address as chairperson", async () => {
      const accounts = await ethers.getSigners();
      const ballotFactory = await ethers.getContractFactory("Ballot");
      const ballotContract = await ballotFactory.deploy(
        convertStringArrayToBytes32(PROPOSALS)
      );
      await ballotContract.waitForDeployment();
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(accounts[0].address); // because we are using hardhat, the first address is the deployer.
    });
  });
});
