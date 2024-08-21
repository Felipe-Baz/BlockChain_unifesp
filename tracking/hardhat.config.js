require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 31337 // Verifique se o chainId está correto
    },
    // Outras redes, se necessário
  }
};
