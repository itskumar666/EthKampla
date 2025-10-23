const hre = require("hardhat");

async function main() {
  console.log("Deploying SavingsPool contract to Base Sepolia...");

  const SavingsPool = await hre.ethers.getContractFactory("SavingsPool");
  const savingsPool = await SavingsPool.deploy();

  await savingsPool.waitForDeployment();

  const address = await savingsPool.getAddress();
  console.log(`✅ SavingsPool deployed to: ${address}`);
  console.log(`\n📝 Add this to your .env.local file:`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
