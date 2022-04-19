const fs = require("fs");
const ethers = require("ethers");

var wlAddresses = [
  "0xf0773736d0f58b04CB17476e5619d528f4Efb0da",
  "0xC8903A1BeB1772bFad93F942951eB17455830985"
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
