import { ethers } from 'ethers'

const Section = ({ title, products, togglePop }) => {
    return (
        <div className='cards__section'>
            <h3 id={title}>{title}</h3>

            <hr />

            <div className='cards'>
                {products.map((product, index) => (

                    <div className='card' key={index} onClick={() => togglePop(product)}>
                        <div className='card__image'>
                            <img src={product.ipfsImage} alt="Product" />
                        </div>
                        <div className='card__info'>
                            <h4>{product.name}</h4>
                            <p>{ethers.utils.formatUnits(product.price.toString(), 'ether')} ETH</p>
                        </div>

                    </div>

                ))}
            </div>

        </div>
    );
}

export default Section;