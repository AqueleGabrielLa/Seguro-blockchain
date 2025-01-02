/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",  
      accounts: [`0x${process.env.PRIVATE_KEY}`], 
      chainId: 80002,                    
    },
  },
};
