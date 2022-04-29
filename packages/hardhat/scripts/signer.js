const fs = require("fs");
const ethers = require("ethers");

var wlAddresses = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
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

  const wlSigs = await signWith(wlWallet, wlAddresses);

  fs.mkdirSync("./output");
  fs.writeFileSync("./output/wlSigs.json", JSON.stringify(wlSigs, null, 2));
  fs.writeFileSync(
    "./output/signers.json",
    JSON.stringify(
      {
        wlSigner: wlWallet.address,
      },
      null,
      2
    )
  );
}

run();