require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, JSON_RPC_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",

  networks: {
    arbsep: {
      url: `${JSON_RPC_URL}`,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
};
