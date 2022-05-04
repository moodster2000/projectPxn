// deploy/00_deploy_your_contract.js

const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("Ghost", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const YourContract = await ethers.getContract("Ghost", deployer);
  await YourContract.devMint();
  console.log(await YourContract.balanceOf("0xC8903A1BeB1772bFad93F942951eB17455830985"), "before balance");

  /*  await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    await yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  //test For Reveal ✅
  //test unrevealed
  // await YourContract.setRevealData(false);
  // console.log(await YourContract.REVEALED(), "hello");
  // await YourContract.setBaseURI("https://storage.googleapis.com/prereveal_riceday/RiceDay.json");
  // console.log(await YourContract.tokenURI(1), "yum");

  // //test revealed
  // await YourContract.setRevealData(true);
  // console.log(await YourContract.REVEALED(), "hello");
  // await YourContract.setBaseURI(
  //   "https://storage.googleapis.com/revealdata/actual/"
  // );
  // console.log(await YourContract.tokenURI(1), "yum");

  // const accounts = await hre.ethers.getSigners();
  // await YourContract.setDutchActionActive(true);
  // const test = ethers.utils.formatEther(await YourContract.currentPrice())*3;
  // console.log(test, "Current price");

  //test public auction (changed dutch auction quantity to 20 to test)
  //mint dutch with high and low prices
  // for (var i = 0; i < 20; i++) {
  //   await YourContract.mintDutchAuction(1, {
  //     value: ethers.utils.parseEther(test),
  //   });
  // }
  // await YourContract.mintDutchAuction(3, {
  //   value: ethers.utils.parseEther(test.toString()),
  // });
  // console.log(await YourContract.balanceOf(accounts[0].address), "before balance");
  // const wlprice = ethers.utils.formatEther(await YourContract.WLprice());

  // await YourContract.setTeamMint([accounts[0].address, accounts[1].address], 2);
  // await YourContract.teamMint(2, {
  //   value: ethers.utils.parseEther((0.05*2).toString()),
  // });
  // console.log("your balance", (await YourContract.balanceOf(accounts[0].address)));
  // //check to see if you can retrieve info about mint
  // console.log(await YourContract.userToTokenBatchLength(accounts[0].address));
  // for(var i = 0; i < 1; i++) {
  //   await YourContract.mintDutchAuction(1, {
  //     value: test,
  //   });
  //   console.log(ethers.utils.formatEther(await provider.getBalance(accounts[i].address)), "amount after");
  // }
  // console.log(await YourContract.totalSupply(), "total supply");

  // //WL tests
  // //test signer method
  // await YourContract.setSigners("0x5AF4e1dBDc75424b5a5E2F3B91e7775E222f8337");
  // // presale mint
  // await YourContract.mintWL("0xedfb4fd95ca947c235160d9e039367ce1e113271717b48c0c2dc32d23fcff2e3391b6e5d0347cd1390eab3f160623492d9b4a71bc2670984570f0a7bbba69ebd1b",{
  //   value: test,
  // });
  // console.log(await YourContract.totalSupply().toString(), "total supply");

  //  // Team Mint
  //  await YourContract.setTeamMint(["0xC8903A1BeB1772bFad93F942951eB17455830985"],"3");
  //  await YourContract.teamMint("3");

  // //airdrop rest of supply to dev fund
  // await YourContract.devMint();

  // // payout feature test
  // let founderAdd = ethers.utils.getAddress("0x0E861ddDA17f7C20996dC0868cAcc200bc1985c0");
  // let devAdd = ethers.utils.getAddress("0xBC77EDd603bEf4004c47A831fDDa437cD906442E");
  // console.log(ethers.utils.formatEther(await provider.getBalance(founderAdd)));
  // await YourContract.withdrawFunds();
  // console.log(ethers.utils.formatEther(await provider.getBalance(founderAdd)));

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/Ghost.sol:Ghost",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["YourContract"];
