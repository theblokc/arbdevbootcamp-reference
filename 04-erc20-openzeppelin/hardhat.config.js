require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, JSON_RPC_URL, ARBISCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  networks: {
    arbsep: {
      url: `${JSON_RPC_URL}`,
      accounts: [`${PRIVATE_KEY}`],
    },
  },

  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: {
      arbsep: `${ARBISCAN_API_KEY}`
    },
    customChains: [
      {
        network: "arbsep",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/"
        }
      }
    ]
  }
};
