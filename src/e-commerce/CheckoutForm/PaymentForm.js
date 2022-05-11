import React from 'react'
import { Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';
import { useAuthContext } from "../../contexts/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";



function PaymentForm({checkoutToken, nextStep, backStep, shippingData, /* onCaptureCheckout, */ timeout}) {
  const { currentUser } = useAuthContext();
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const fns = require('date-fns')

    // const [orderInfo, setOrderInfo] = useState({})

    const handleSubmit = async (event, elements, stripe) => {
        event.preventDefault();
    
      /* 
      Logik för att verifiera kortbetalning
      
      if (!stripe || !elements) return;
    
        const cardElement = elements.getElement(CardElement);
    
        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
    
        if (error) {
          console.log('[error]', error);
        } else { */

          const currentTime = fns.format(new Date(), "yyyy-MM-dd HH:mm")
          const timestamp = Date.now();

          await addDoc(collection(db, "orders"), {
              owner_uid: currentUser.uid,
              time: currentTime,
              timestamp: timestamp,
              line_items: checkoutToken.live.line_items,
              firstname: shippingData.firstName, 
              lastname: shippingData.lastName,
              country: shippingData.country,
              email: shippingData.email,
              street: shippingData.address,
              town_city: shippingData.city,
              zipCode: shippingData.zipcode, 
              shipping_method: shippingData.shippingType,
              totalPrice: checkoutToken.live.subtotal.formatted,
              orderId: checkoutToken.created,
            })
          timeout();
          nextStep();
      }

    return (
        <>
        <Review checkoutToken={checkoutToken}/>
        <Divider />
      <h4 className="paymentMethod">Betalningsmetod</h4>
      <p className="paymentText">OBS! Detta är en prototyp och inga pengar kommer dras från kontot. </p>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>{({ elements, stripe }) => (
          <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
            <CardElement />
            <br /> <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={backStep}>Back</Button>
              <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                Betala {checkoutToken.live.subtotal.formatted}
              </Button>
            </div>
          </form>
        )}
        </ElementsConsumer>
      </Elements>
        </>
    )
}

export default PaymentForm
