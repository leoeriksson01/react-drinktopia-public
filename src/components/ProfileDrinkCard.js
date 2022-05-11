import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import useDeleteDrink from "../hooks/useDeleteDrink";
import toast from "react-hot-toast";
import closeicon from "../assets/closeicon.png";


const ProfileDrinkCard = ({drink}) => {
    const navigate = useNavigate();
    const [confirmModal, setConfirmModal] = useState(false)

    const deleteDrink = useDeleteDrink(drink?.docId);

    const deleteDrinkFunction = async () => {
        await deleteDrink.mutate().then(
            toast.success(
                "Drinken är borttagen",
                {
                    duration: 3000,
                }
            ),
            setConfirmModal(false)
        );
    };

    if (!drink) return;


  return (
    <div className="recipeCard">
    <div className="statusContainer" onClick={() =>
        navigate(
            `/drink/${drink.docId}`
        )
    }>
        <img
        alt="drink"
            src={
                drink.image_src
            }
            height="300"
            width="300"
        />
        {drink.accepted ? (
            <div className="accepted">
                {" "}
                <h4>
                    Accepterad{" "}
                </h4>{" "}
            </div>
        ) : (
            <div className="pending">
                {" "}
                <h4>
                    Väntar
                    på
                    beslut{" "}
                </h4>
            </div>
        )}
    </div>
    <h3 onClick={() =>
        navigate(
            `/drink/${drink.docId}`
        )
    }>
        {drink.name}
    </h3>
    <div className="modalButtons">
                    <div className="deleteButton" onClick={() => setConfirmModal(true)}> Ta bort </div>
                     <div className="closeButton" onClick={() => navigate(`/redigera/${drink?.docId}`)}> Redigera </div>
                    </div>


                    {confirmModal &&
    <div className="confirmModal">
         <img
                    src={closeicon}
                    onClick={() => setConfirmModal(false)}
                    className="closeIcon"
                    width="20"
                    height="20"
                    alt="Logo"
                />
                <div className="modalWrapper">
                <p className="modalText">
                    Är du säker på att du vill ta bort det här receptet permanent?
                </p>
                <div className="modalButtons">
                    <div className="deleteButton" onClick={deleteDrinkFunction}> Ta bort </div>
                    <div className="closeButton" onClick={() => setConfirmModal(false)}> Avbryt </div>
                    </div>
                    </div>
    </div>}
</div>
  )
}

export default ProfileDrinkCard