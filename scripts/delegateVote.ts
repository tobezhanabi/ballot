import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();
// contract 0xec16A8B63111Bcde389D72668Cc5453761b64988
async function main() {
  const parameter = process.argv.slice(2);
  const contractAddress = parameter[0];
  const delegateAddress = parameter[1];

  const provider = new ethers.JsonRpcProvider(
    process.env.ALCHEMY_API_KEY ?? ""
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  const ballotFactory = new Ballot__factory(wallet); // this is gotten from typechain
  const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
  const tx = await ballotContract.delegate(delegateAddress);
  console.log(
    `${delegateAddress} has been delegated to vote on this contract ${contractAddress}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
