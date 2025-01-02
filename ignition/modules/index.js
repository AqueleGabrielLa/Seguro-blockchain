const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Apolices", (a) => {
  const index = a.contract("index", [""]);

  return { index };
});