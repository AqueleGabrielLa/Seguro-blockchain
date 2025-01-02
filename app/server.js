const express = require('express');
const { JsonRpcProvider } = require('ethers');
const Contrato = require("../artifacts/contracts/index.sol/SeguroDidaticoCompleto.json");
const { ethers } = require('ethers');

require('dotenv').config();

const app = express();
app.use(express.json());

const provider = new JsonRpcProvider(process.env.RPC_URL); 
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = Contrato.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});

module.exports = contract;