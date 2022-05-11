import { useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import "../styles/ProfilePageStyle.scss";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import CreateDrink from "../components/CreateDrink";
import ProfileDrinkCard from "../components/ProfileDrinkCard";

function ProfilePage() {
    const { currentUser } = useAuthContext();

    const { uid } = useParams();

    const queryRef = query(
        collection(db, "drinks"),
        where("creator_uid", "==", uid)
    );
    const { data: drinks } = useFirestoreQueryData(
        ["drinks"],
        queryRef,
        {
            idField: "docId",
            subscribe: true,
        },
        {
            refetchOnMount: "always",
        }
    );

    return (
        <div className="profilePageContainer">
            {currentUser && (
                <>
                    <div>
                        <div className="profileGreeting">
                            {" "}
                            <h2>
                                {" "}
                                Välkommen {currentUser?.displayName}, här kan du
                                lägga till och dela med dig av dina
                                favoritrecept
                            </h2>{" "}
                        </div>

                        <div className="profileRecipeOrderContainer">
                            <div className="profileOrderContainer">{}</div>

                            <div className="profileRecipeContainer">
                                {drinks?.length > 0 ? (
                                    <div>
                                        <p> Du har {drinks?.length} recept</p>
                                        <div className="profileRecipeList">
                                            {drinks && (
                                                <>
                                                    {drinks?.map((drink, i) => (
                                                        <ProfileDrinkCard
                                                            drink={drink}
                                                            key={i}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p>
                                        Du har {drinks?.length} recept, lägg upp
                                        ditt första recept!{" "}
                                    </p>
                                )}
                            </div>
                        </div>

                        <CreateDrink />
                    </div>
                </>
            )}
        </div>
    );
}

export default ProfilePage;
