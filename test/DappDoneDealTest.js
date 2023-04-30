const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

// Global constants for listing an item...
const NAME = "Shoes"
const CATEGORY = "Clothing & Jewelry"
const PRICE = tokens(1)
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const DESCRIPTION = "A brand new pair of Puma shoes. Size 8 mens. Never worn."
const COUNTRY = "Ireland"

describe("DappDoneDeal", () => {
    let dappDoneDeal
    let deployer, seller, buyer

    beforeEach(async () => {

        // Get accounts for testing
        [deployer, seller, buyer] = await ethers.getSigners()

        // Before each test, deploy the contract
        const contract = await ethers.getContractFactory("DappDoneDeal")
        dappDoneDeal = await contract.deploy()
    })

    describe("Product Listing", () => {
        let transaction

        beforeEach(async () => {
            // List a item
            transaction = await dappDoneDeal.connect(seller).listNewProduct(NAME, CATEGORY, PRICE, IMAGE, DESCRIPTION, COUNTRY)
            await transaction.wait()
        })

        it("Returns correct product details", async () => {
            const product = await dappDoneDeal.products(1)
      
            expect(product.id).to.equal(1)
            expect(product.name).to.equal(NAME)
            expect(product.category).to.equal(CATEGORY)
            expect(product.price).to.equal(PRICE)
            expect(product.sold).to.equal(false)
            expect(product.seller).to.equal(seller.address)
            expect(product.ipfsImage).to.equal(IMAGE)
            expect(product.description).to.equal(DESCRIPTION)
            expect(product.country).to.equal(COUNTRY)
        })

        it("Validates the name and category", async () => {

            let invalidListingTransaction = dappDoneDeal.connect(seller).listNewProduct("", CATEGORY, PRICE, IMAGE, DESCRIPTION, COUNTRY)
            await expect(invalidListingTransaction).to.be.revertedWith("Cannot provide an empty name")

            invalidListingTransaction = dappDoneDeal.connect(seller).listNewProduct(NAME, "Invalid Category", PRICE, IMAGE, DESCRIPTION, COUNTRY)
            await expect(invalidListingTransaction).to.be.revertedWith("Invalid category name provided")
        })

        it("Emits ProductListing event", () => {
            expect(transaction).to.emit(dappDoneDeal, "ProductListing")
        })
    })

    describe("Product Buying", () => {
        let transaction, sellerBalanceBefore, buyerBalanceBefore, sellerBalanceAfter, buyerBalanceAfter
    
        beforeEach(async () => {
            // List a item
            transaction = await dappDoneDeal.connect(seller).listNewProduct(NAME, CATEGORY, PRICE, IMAGE, DESCRIPTION, COUNTRY)
            await transaction.wait()

            // Get seller's balance before their product is bought
            sellerBalanceBefore = await ethers.provider.getBalance(seller.address)

            // Get seller's balance before their product is bought
            buyerBalanceBefore = await ethers.provider.getBalance(buyer.address)
    
            // Buy a item
            transaction = await dappDoneDeal.connect(buyer).buyProduct(1, { value: PRICE })
            await transaction.wait()
        })

        it("Updates buyer's products purchased counter", async () => {
            const purchasesCounter = await dappDoneDeal.purchaseCounter(buyer.address)
            expect(purchasesCounter).to.equal(1)
        })

        it("Sets the sold variable for both the product and purchase structs to true", async () => {
            const purchase = await dappDoneDeal.purchases(buyer.address, 1)
            expect(purchase.product.sold).to.equal(true)

            const product = await dappDoneDeal.products(1)
            expect(product.sold).to.equal(true)
        })

        it("Increases sellers balance", async () => {
            sellerBalanceAfter = await ethers.provider.getBalance(seller.address)
            expect(sellerBalanceAfter).to.be.greaterThan(sellerBalanceBefore)
        })

        it("Decreases buyers balance", async () => {
            buyerBalanceAfter = await ethers.provider.getBalance(buyer.address)
            expect(buyerBalanceAfter).to.be.lessThan(buyerBalanceBefore)
        })

        it('Returns contract balance to zero', async () => {
            const result = await ethers.provider.getBalance(dappDoneDeal.address)
            expect(result).to.equal(0)
          })

        it("Sets purchase timestamp, buyer address and correct product", async () => {
            const purchase = await dappDoneDeal.purchases(buyer.address, 1)
            expect(purchase.timestamp).to.be.greaterThan(0)
            expect(purchase.product.id).to.equal(1)
            expect(purchase.product.name).to.equal(NAME)
            expect(purchase.product.category).to.equal(CATEGORY)
            expect(purchase.product.price).to.equal(PRICE)
            expect(purchase.product.sold).to.equal(true)
            expect(purchase.product.seller).to.equal(seller.address)
            expect(purchase.product.ipfsImage).to.equal(IMAGE)
            expect(purchase.buyer).to.equal(buyer.address)
        })

        it("Emits a BuyEvent", () => {
            expect(transaction).to.emit(dappDoneDeal, "BuyEvent")
          })

    })


})