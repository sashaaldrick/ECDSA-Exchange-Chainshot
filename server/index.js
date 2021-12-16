// imports
const SHA256 = require('crypto-js/sha256');
const express = require('express');
const EC = require('elliptic').ec; // elliptic curve cryptography library for the generation of public and private keys
const app = express();
const cors = require('cors');
const port = 3042;

// code copied from https://github.com/ChainShot/ECDSA-Signatures/blob/master/generate.js

var ec = new EC('secp256k1'); // documentation says better to do once and reuse it.
// "create EC conhash1"
const key1 = ec.genKeyPair();
const key2 = ec.genKeyPair();
const key3 = ec.genKeyPair();

const publicKey1 = key1.getPublic().encode('hex');
const publicKey2 = key2.getPublic().encode('hex');
const publicKey3 = key3.getPublic().encode('hex');

const privateKey1 = key1.getPrivate().toString();
const privateKey2 = key2.getPrivate().toString();
const privateKey3 = key3.getPrivate().toString();

const hash1 = SHA256(publicKey1).toString();
const hash2 = SHA256(publicKey2).toString();
const hash3 = SHA256(publicKey3).toString();

// eth style address with truncation of the last 40 characters

let address1 = hash1.substring(hash1.length - 40);
let address2 = hash2.substring(hash2.length - 40);
let address3 = hash3.substring(hash3.length - 40);

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// we want to use the https://github.com/paulmillr/noble-secp256k1 library to create public/private key pairs and then fund the addresses below

// let's first try with https://www.npmjs.com/package/elliptic as it seems much more straightforward

const balances = {
  [address1]: 100,
  [address2]: 50,
  [address3]: 75,
};

const privateKeys = {
  privateKey1,
  privateKey2,
  privateKey3,
};

console.log(balances); // as required by challenge 1
console.log(privateKeys); // for verification in challenge 2

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
