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

  await deploy("PXN", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const YourContract = await ethers.getContract("PXN", deployer);
  /*  await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // await yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  //test For Reveal ✅
  // await YourContract.setRevealData(false);
  // console.log(await YourContract.REVEALED(), "hello");
  // await YourContract.setBaseURI("https://storage.googleapis.com/prereveal_riceday/RiceDay.json");
  // console.log(await YourContract.tokenURI(1), "yum");
  // await YourContract.setRevealData(true);
  // console.log(await YourContract.REVEALED(), "hello");
  // await YourContract.setBaseURI("https://storage.googleapis.com/revealdata/actual/");
  // console.log(await YourContract.tokenURI(1), "yum");

  const accounts = await hre.ethers.getSigners();
  // console.log(ethers.utils.formatEther(await accounts[0].getBalance(), "balance of current user"))
  const test = await YourContract.currentPrice();
  console.log(ethers.utils.formatEther(test), "Current price");

  //test public auction

    //mint dutch with high and low prices
    // const ethAmount = 0.85;
    // for(var i = 0; i < 1; i++) {
    //   // var newAddress = ethers.Wallet.createRandom();
    //   console.log(ethers.utils.formatEther(await provider.getBalance(accounts[i].address)), "amount"); 
    //   YourContract.connect(accounts[i].address);
    //   console.log(accounts[i].address)
    //   await YourContract.mintDutchAuction(1, {
    //     value: test,
    //   });
    //   console.log(ethers.utils.formatEther(await provider.getBalance(accounts[i].address)), "amount after"); 
    // }
    // console.log(await YourContract.totalSupply(), "total supply");


    //refund test mint 19 -> mint 1 after some time. -> refund 
    console.log(ethers.utils.formatEther(await provider.getBalance(accounts[0].address)), "before"); 
    await YourContract.refundExtraETH();
    console.log(ethers.utils.formatEther(await provider.getBalance(accounts[0].address)), "after"); 
  //WL tests
    //test signer method
    // await YourContract.setSigners("0x5AF4e1dBDc75424b5a5E2F3B91e7775E222f8337");
    // presale mint
    // await YourContract.mintWL("0xedfb4fd95ca947c235160d9e039367ce1e113271717b48c0c2dc32d23fcff2e3391b6e5d0347cd1390eab3f160623492d9b4a71bc2670984570f0a7bbba69ebd1b",{
    //   value: test,
    // });
    // console.log(await YourContract.totalSupply().toString(), "total supply");

  //airdrop rest of supply to dev fund
  // await YourContract.devMint();

  
  // payout feature test
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
  //       contract: "contracts/YourContract.sol:YourContract",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["YourContract"];
