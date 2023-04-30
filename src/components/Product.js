import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
// import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ product, provider, account, dappDoneDeal, togglePop }) => {

  const [hasBought, setHasBought] = useState(false)
  const [purchase, setPurchase] = useState(null)

  const fetchDetails = async () => {
    console.log("dappdonedeal === " + dappDoneDeal)
    const events = await dappDoneDeal.queryFilter("BuyEvent")
    const purchases = events.filter(
      (event) => event.args.buyer === account && event.args.productId.toString() === product.id.toString()
    )

    if (purchases.length === 0) return

    const purchase = await dappDoneDeal.purchases(account, purchases[0].args.purchaseId)
    setPurchase(purchase)
  }

  const buyHandler = async () => {
    const signer = await provider.getSigner(account)

    console.log("signer === " + signer.address)
    console.log("account === " + account)

    // Buy item...
    let transaction = await dappDoneDeal.connect(signer).buyProduct(product.id, { value: product.price })
    await transaction.wait()

    setHasBought(true)
  }

  useEffect(() => {
    fetchDetails()
  }, [hasBought]) // recall fetchDetails if hasBought changes

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={product.ipfsImage} alt="Product" />
        </div>
        <div className="product__overview">
        <h1>{product.name}</h1>

          <hr />

          <p>{product.address}</p>

          <h2>{ethers.utils.formatUnits(product.price.toString(), 'ether')} ETH</h2>

          <hr />

          <h2>Overview</h2>

          <p>
            {product.description}
          </p>
        </div>

        <div className="product__order">
          <h1>{ethers.utils.formatUnits(product.price.toString(), 'ether')} ETH</h1>

          <p>
            Delivery in: <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </strong>
          </p>

          {product.sold === false ? (
            <p>Product available.</p>
          ) : (
            <p>Product already sold.</p>
          )}

          <button className='product__buy' onClick={buyHandler}>
            Buy Now
          </button>

          <p><small>Ships from: </small> {product.country} </p>
          <p><small>Seller: </small> {product.seller.slice(0, 6) + '...' + product.seller.slice(38, 42)}</p>

          {/* {product.sold === true && purchase && (
            <p><small>Buyer: </small> {purchase.buyer.slice(0, 6) + '...' + purchase.buyer.slice(38, 42)}</p>
          ) : (
            <></>
          )} */}

          {purchase && (
            <div className='product__bought'>
              Product purchased on <br />
              <strong>
                {new Date(Number(purchase.timestamp.toString() + '000')).toLocaleDateString(
                  undefined,
                  {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
              </strong>
              <p><small>Product sold to address: </small> {purchase.buyer.slice(0, 6) + '...' + purchase.buyer.slice(38, 42)}</p>
            </div>
          )}

        </div>

        <button onClick={togglePop} className="product__close">
          <img src={close} alt="Close" />
        </button>

      </div>

    </div >
  );
}

export default Product;