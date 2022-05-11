import React from "react";
import "../styles/CategoryPageStyle.scss";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
} from "@firebase/firestore";
import { db } from '../firebase'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import { useNavigate } from "react-router-dom";

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const queryRef = query(
		collection(db, 'drinks'),
		where("category", "==", category),
	)
	const { data } = useFirestoreQueryData(['drinks'], queryRef, {
		idField: 'docId',
		subscribe: true,
	}, {
    refetchOnMount: "always",
  })

  const acceptedDrinks = data?.filter(drink => drink.accepted === true)

  return (
    <div>
      <div className="categoryHeader">
        <h1> {category}</h1>{" "}
      </div>
      {data && (
        <div className="grid">
          {acceptedDrinks.map((drink, i) => {
            return (
              <div
                className="drinkContainer"
                key={i}
                onClick={() => navigate(`/drink/${drink.docId}`)}
              >
                <div className="imageContainer">
                  <img src={drink.image_src} width="100%" height="100%" alt="drink"/>
                </div>
                <h3>{drink.name}</h3>
              </div>
            );
          })}
        </div>
      )}

    
    </div>
  );
}

export default CategoryPage;
