import React from "react";
import "../../styles/ProductsStyle.scss"
import Product from "../product/Product"

function Products({ products, onAddToCart }) {
    return (
        <div className="productsContainer"> 
        <div className="grid">
        {products.map((product, i) => (
           <div
           className="drinkContainer"
            key={i}
         >
            <Product product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
        </div>
        </div>
    )
}

export default Products
