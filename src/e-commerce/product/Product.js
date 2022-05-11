import React from 'react'
import { useNavigate } from 'react-router-dom'


function Product({product, onAddToCart}) {
    const navigate = useNavigate()
    return (
        <div className="product">
                   <img className="productImage" src={product.image.url} width="100%" onClick={() => navigate(`/produkt/${product.id}`)} alt="product" />
                 <h4 onClick={() => navigate(`/produkt/${product.id}`)}>{product.name}</h4>
                 <div className="productBottom"> 
                 <h4 className="productPrice"> {product.price.formatted} SEK</h4>
                 <button className="addToCartButton" aria-label="Add to Cart" onClick={() => onAddToCart(product.id, 1)}>
                   Lägg till i varukorg
        </button>
        </div>
               
        </div>
    )
}

export default Product
