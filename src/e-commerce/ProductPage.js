import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { commerce } from "../lib/commerce";
import linebreaker from "../assets/linebreaker.png";

function ProductPage({ onAddToCart}) {
    const { id } = useParams();
    const [product, setProduct] = useState({});

    useEffect(() => {
        commerce.products.retrieve(id).then((product) => setProduct(product));
        
    }, [id])
    
    return (
        <div className="singleDrinkContainer"> 
        {product && <>
        
        <div>
      <div className="drinkTop">
        <h1> {product?.name} </h1>
        <p className="newsDescription" dangerouslySetInnerHTML={{__html: product?.description}}></p>
        <div className="lineBreaker">
                                <img
                                    src={linebreaker}
                                    width="100%"
                                    alt="linebreaker"
                                />
                            </div>
      </div>

      <div className="drinkInfo">
        <div className="drinkImageContainer">
          <img src={product?.image?.url} width="100%" height="100%" alt="product" />
        </div>
        
        <div className="drinkMainInfo">
           <h3> {product?.price?.formatted_with_code}</h3>
        <button className="addToCartButton" aria-label="Add to Cart" onClick={() => onAddToCart(product.id, 1)}>
                   Lägg till i varukorg
        </button>
        
         
        </div>
      </div>
      
    </div>
        </>}
        </div> )
    
}

export default ProductPage
