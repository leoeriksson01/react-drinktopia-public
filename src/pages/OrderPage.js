
import { useAuthContext } from "../contexts/AuthContext";
import "../styles/ProfilePageStyle.scss";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import "../styles/OrderPageStyle.scss"
import OrderCard from "../components/OrderCard";

function OrderPage() {
    const { currentUser} = useAuthContext();
    

    const queryRef = query(
		collection(db, 'orders'),
		where("owner_uid", "==", currentUser.uid))

      
	const { data } = useFirestoreQueryData(['orders'], queryRef, {
		idField: 'docId',
		subscribe: true,
	}, {
    refetchOnMount: "always",
  })

  data?.sort((a,b) => b?.timestamp - a?.timestamp)



    return (
        <div className="profilePageContainer">
             {data ? (
                <>
                <h2> Du har {data?.length === 1 ? "1 beställning" : data?.length +  " beställningar"} </h2>
                    <>
                     <div className="orderContainer">
                    {data?.map((order, i) => 
                      <OrderCard order={order} key={i}/>
                    )}
                </div>
                    </>
                </>
            ) : <h2> Du har inga beställningar </h2>} 
            
        </div>
    )
}

export default OrderPage
