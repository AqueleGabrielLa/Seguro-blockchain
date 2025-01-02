const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Implantando com a conta:", deployer.address);

//   const Contract = await ethers.getContractFactory("SeguroDidaticoCompleto");
//   const contract = await Contract.deploy();
//   console.log("Contrato implantado para:", contract.address);
// }


// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
// });

module.exports = buildModule("Apolices", (a) => {
  const index = a.contract("index", [""]);

  return { index };
});