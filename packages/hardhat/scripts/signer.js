const fs = require("fs");
const ethers = require("ethers");

var wlAddresses = [
  "0x4A0C2B91e2DC344C0c77184F1A0B9cc62a836187",
  "0x2a26637C0535D2BCF2C4Fa40B5080416ED8aC027",
  "0x19b260a039eDa8b896F4c7463445Fb94b4C86a85"
];

async function signWith(signer, addresses) {
  const messages = {};
  for (let i = 0; i < addresses.length; i++) {
    const addr = ethers.utils.getAddress(addresses[i]);
    const message = `0x000000000000000000000000${addr.substring(2)}`;
    const signed = await signer.signMessage(ethers.utils.arrayify(message));
    messages[addr.toUpperCase()] = signed;
  }
  return messages;
}

async function run() {
  const wlWallet = ethers.Wallet.createRandom();
  const daWallet = ethers.Wallet.createRandom();
  
  const wlSigs = await signWith(wlWallet, wlAddresses);

  fs.mkdirSync("./output");
  fs.writeFileSync("./output/wlSigs.json", JSON.stringify(wlSigs, null, 2));
  fs.writeFileSync(
    "./output/signers.json",
    JSON.stringify(
      {
        wlSigner: wlWallet.address,
        daSigner: daWallet.address,
        daPrivateKey: daWallet.privateKey,
      },
      null,
      2
    )
  );
}

run();