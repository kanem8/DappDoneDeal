// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { products } = require("../src/products.json")

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Accounts setup
  const [deployer, seller1, seller2, seller3] = await hre.ethers.getSigners()

  // Deploy DappDoneDeal contract to hardhat node
  const DappDoneDeal = await hre.ethers.getContractFactory("DappDoneDeal")
  const dappDoneDeal = await DappDoneDeal.deploy()
  await dappDoneDeal.deployed()

  console.log(`Deployed DappDoneDeal contract to address: ${dappDoneDeal.address}\n`)

  // List some products
  // seller1 (account 1) will list some electronics & gadgets products
  for (let i = 0; i < 3; i++) {
    const transaction = await dappDoneDeal.connect(seller1).listNewProduct(
      products[i].name, 
      products[i].category, 
      tokens(products[i].price), 
      products[i].image,
      products[i].description,
      products[i].country)

    await transaction.wait()

    console.log(`Account ${seller1.address} listed item: ${products[i].name}`)
  }

  // seller2 (account 2) will list some Clothing & Jewelry products
  for (let i = 3; i < 6; i++) {
    const transaction = await dappDoneDeal.connect(seller2).listNewProduct(
      products[i].name, 
      products[i].category, 
      tokens(products[i].price), 
      products[i].image,
      products[i].description,
      products[i].country)

    await transaction.wait()

    console.log(`Account ${seller2.address} listed item: ${products[i].name}`)
  }

      // seller3 (account 3) will list some Toys & Gaming products
  for (let i = 6; i < 9; i++) {
    const transaction = await dappDoneDeal.connect(seller3).listNewProduct(
      products[i].name, 
      products[i].category, 
      tokens(products[i].price), 
      products[i].image,
      products[i].description,
      products[i].country)

    await transaction.wait()

    console.log(`Account ${seller3.address} listed item: ${products[i].name}`)
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});