// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DappDoneDeal {
    // string public name;
    string[] allowedCategories = ["Clothing & Jewelry", "Electronics & Gadgets", "Toys & Gaming"];

    uint256 public productCount;

    // Store products by ID
    mapping(uint256 => Product) public products;

    // For each buyer store a count of their purchases
    mapping(address => uint256) public purchaseCounter;

    // For each buyer store a list of their purchases 
    mapping(address => mapping(uint256 => Purchase)) public purchases; 


    event ProductListing(string name, uint256 price);
    event BuyEvent(address buyer, uint256 purchaseId, uint256 productId);

    modifier onlySeller(address _addr, uint256 _productId) {
        require(_addr != address(0), "Address must not be zero");
        address productLister = products[_productId].seller;
        require(_addr == productLister, "Address withdrawing must be the seller of product being bought");
        _;
    }

    // Model a Product
    struct Product {
        uint256 id;
        string name;
        string category;
        uint256 price;
        bool sold;
        address seller;
        string ipfsImage;
        string description;
        string country;
    }

    // Model a purchase
    struct Purchase {
        uint256 timestamp;
        Product product;
        address buyer;
    }

    constructor() {
        productCount = 0;
    }

    function listNewProduct (        
        string memory _name,
        string memory _category,
        uint256 _price,
        string memory _ipfsImage,
        string memory _description,
        string memory _country) public {

            require(bytes(_name).length > 0, "Cannot provide an empty name");
            require(bytes(_category).length > 0 && validateCategory(_category), "Invalid category name provided");

            productCount++;
            products[productCount] = Product(productCount, _name, _category, _price, false, msg.sender, _ipfsImage, _description, _country);

            // Emit product listing event
            emit ProductListing(_name, _price);
    }

    function validateCategory(string memory category) private view returns(bool) {
        for (uint i = 0; i < allowedCategories.length; i++) {
            if (keccak256(bytes(allowedCategories[i])) == keccak256(bytes(category))) {
                return true;
            }
        }
        return false;
    }

    function buyProduct(uint256 _id) public payable {

        // Fetch product by _id
        Product memory product = products[_id];

        // Buyer must send enough eth to buy product
        require(msg.value >= product.price);

        // Require that product isn't already sold
        require(!product.sold);

        // Create purchase
        Purchase memory purchase = Purchase(block.timestamp, product, msg.sender);

        // increment the purchase count for the buyer and then save purchase to buyer
        purchaseCounter[msg.sender]++;
        purchases[msg.sender][purchaseCounter[msg.sender]] = purchase;

        // Transfer ether from buyer to seller
        transferToSeller(product.seller, _id);

        // Set sold variable to true for both product and purchase
        products[_id].sold = true;
        purchases[msg.sender][purchaseCounter[msg.sender]].product.sold = true;

        // Emit buying event
        emit BuyEvent(msg.sender, purchaseCounter[msg.sender], product.id);

    }

    function transferToSeller(address _seller, uint256 _productId) private onlySeller(_seller, _productId) {
        (bool success, ) = _seller.call{value: address(this).balance}("");
        require(success);
    }

}