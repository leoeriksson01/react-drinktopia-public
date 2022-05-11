import React, {useState} from 'react'
import { useNavigate} from "react-router-dom";
import expandarrow from "../assets/expandarrow.png"


const OrderCard = ({order, ...rest}) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div className="orderCard" onClick={() => setIsExpanded(!isExpanded)} {...rest}>
    <div className="orderRow grayBackground">
        <div className="orderColumn">
        <h4 className="gray">Datum: </h4>
        <h4>{order.time} </h4>
        </div>

        <div className="orderColumn">
        <h4 className="gray">Ordernummer: </h4>
        <h4>{order.orderId} </h4>
        </div>
        
       

        <div className="orderColumn">
        <h4 className="gray">Pris: </h4>
        <h4>{order.totalPrice} kr </h4>
        </div>

        <div className="orderColumn showMore">
            {isExpanded ?  <h4>Dölj <img className="reverseArrow" alt="arrow"src={expandarrow} width="14"/></h4> :  <h4 onClick={() => setIsExpanded(!isExpanded)}>Visa <img className="expandArrow" alt="arrow"src={expandarrow} width="14"/></h4>}
        </div>
        </div>



        {isExpanded &&
        <> 
       {order.line_items.map((orderItem, i) => (
          
           <div className="orderRow" key={i}>
               <div className="orderColumn"> 
               <img src={orderItem.image.url} width="100px" height="100px" alt="item" />
               </div>
               <div className="orderColumn"> 
               <h4 className="link" onClick={() => navigate(`/produkt/${orderItem.product_id}`)}> {orderItem.name}</h4>
               </div>

        <div className="orderColumn">
        <h4 className="gray">Antal: </h4>
        <h4>{orderItem.quantity} </h4>
        </div>

        <div className="orderColumn">
        <h4 className="gray">Pris: </h4>
        <h4>{orderItem.price.formatted} kr </h4>
        </div>
           </div>
          
       ))}

       <div className="orderRow grayBackground">
           <div className="orderColumn">
               <h4 className="gray"> Levereras av </h4>
               <h4> {order.shipping_method}</h4>
               </div>
               <div className="orderColumn">
               <h4 className="gray"> Till </h4>
               <h4> {order.firstname} {order.lastname}</h4>
               </div>
               <div className="orderColumn">
               <h4 className="gray"> Email </h4>
               <h4>{order.email} </h4>
               </div>

               <div className="orderColumn">
        <h4 className="gray ">Levereras till: </h4>
        <h4> {order.street} </h4>
        <h4> {order.zipCode}, {order.town_city},</h4>
        <h4> {order?.country}</h4>
        </div>

           </div>
        



           </>}      
</div>
  )
}

export default OrderCard