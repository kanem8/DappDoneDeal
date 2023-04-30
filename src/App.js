import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import DappDoneDealABI from './DappDoneDealABI.json'

// Config
import config from './config.json'

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [dappDoneDeal, setDappDoneDeal] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [electronics, setElectronics] = useState(null)
  const [toys, setToys] = useState(null)
  const [product, setProduct] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (product) => {
    setProduct(product)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => {
    // Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log(network)

    // Load smart contract & create JS version of smart contract
    const dappDoneDeal = new ethers.Contract(config[network.chainId].dappdonedeal.address, DappDoneDealABI, provider)
    setDappDoneDeal(dappDoneDeal)

    // Load products
    const products = []
    const productsCount = await dappDoneDeal.productCount()

    for(var i = 1; i <= productsCount; i++) {
      const product = await dappDoneDeal.products(i)
      products.push(product)
    }

    const clothing = products.filter((product) => product.category === "Clothing & Jewelry")
    const electronics = products.filter((product) => product.category === "Electronics & Gadgets")
    const toys = products.filter((product) => product.category === "Toys & Gaming")

    setClothing(clothing)
    setElectronics(electronics)
    setToys(toys)

  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>DappDoneDeal Marketplace</h2>

      {electronics && clothing && toys && (
        <>
          <Section title={"Electronics & Gadgets"} products={electronics} togglePop={togglePop} />
          <Section title={"Clothing & Jewelry"} products={clothing} togglePop={togglePop} />
          <Section title={"Toys & Gaming"} products={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
          <Product product={product} provider={provider} account={account} dappDoneDeal={dappDoneDeal} togglePop={togglePop} />
      )}

    </div>
  );
}

export default App;