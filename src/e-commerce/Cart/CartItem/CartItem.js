import React from 'react';
import { useNavigate } from 'react-router-dom'

const CartItem = ({ item, onUpdateCartQty }) => {

  const navigate = useNavigate()
  const handleUpdateCartQty = (lineItemId, newQuantity) => onUpdateCartQty(lineItemId, newQuantity);

  return (
    <div className="cartItem">
      <div className="cartItemImage" onClick={() => navigate(`/produkt/${item?.product_id}`)}>
        <img src={item?.image.url} width="100%" height="100%" alt="item" />
      </div>
      <div className="itemMainInfo">
      <p className="orange"  onClick={() => navigate(`/produkt/${item.product_id}`)}>{item?.name} </p>
      <div className="rowItems"> 
      <button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}>-</button>
          <p className="quantity"> {item?.quantity}</p>
          <button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}>+</button>
      </div>
      </div>
      <div className="itemPrice">
        {item?.line_total.formatted_with_code}
      </div>
    </div>
  );
};

export default CartItem;