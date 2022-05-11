import React from 'react';
import { Link  } from 'react-router-dom';
import "../../styles/CartStyle.scss"
import { PulseLoader } from 'react-spinners'

import { Container, Button } from 'react-bootstrap';

import CartItem from './CartItem/CartItem';

const Cart  = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart}) => {




  const handleEmptyCart = () => onEmptyCart();

  const renderEmptyCart = () => (
    <h3>Du har inga varor i din varukorg, {" "}
      <Link className="link" to="/produkter">lägg till några</Link>
    </h3>
  );

  if (!cart.line_items) return <div id="spinner">
  <PulseLoader color={"#f6a017"} size={30} margin={4} /> </div>;

  const renderCart = () => (
    <>
      <div className="cartList"> 
        {cart.line_items.map((lineItem) => (
            <CartItem key={lineItem.id} item={lineItem} onUpdateCartQty={onUpdateCartQty} onRemoveFromCart={onRemoveFromCart} />
        ))}
      </div>
      <div className="cardDetails">
      <div>
          <Button className="emptyButton" size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Töm varukorgen</Button>
          <Link to="/checkout" className="checkoutButton" size="large" type="button" variant="contained" color="secondary">Checkout</Link>
          
        </div>
        <h4 className="totalPrice">Totalt: {cart.subtotal.formatted_with_code}</h4>
       
      </div>
    </>
  );

  return (

    <div className="cartContainer"> 

    
    <div className="cart"> 
    
    <Container>
      <div className="toolbar" />
      <h1>Varukorg</h1>
      { !cart.line_items.length ? renderEmptyCart() : renderCart() }
    </Container>
      </div>
    </div>
    
  );
};

export default Cart;