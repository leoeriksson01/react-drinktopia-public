import React, { useState } from "react";
import "../styles/SearchPageStyle.scss";
import { collection, query } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import ingredients from "../assets/ingredients.png";
import ingredientsColor from "../assets/ingredientsColor.png";
import cocktail from "../assets/cocktail.png";
import cocktailColor from "../assets/cocktailColor.png";
import ImageMissing from "../assets/imagemissing.jpg";

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const [type, setType] = useState("drinkname");

    const queryRef = query(collection(db, "drinks"));
    const { data } = useFirestoreQueryData(["drinks"], queryRef, {
        idField: "docId",
    });

    const searchedDrinks = data?.filter((drink) => drink.accepted === true);

    return (
        <div className="searchContainer">
            <h1> Sök </h1>
            <input
                className="searchInput"
                type="text"
                placeholder={
                    type === "drinkname" ? "Gin Sour..." : "Tranbärsjuice..."
                }
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="searchMainContent">
                <div className="searchType">
                    <h2> Sök efter </h2>
                    <div className="types">
                        <div
                            className="typeSelection"
                            onClick={() => setType("drinkname")}
                        >
                            {type === "drinkname" ? (
                                <>
                                    <img
                                        src={cocktailColor}
                                        alt="ingredients with color"
                                        height="100px"
                                        width="100px"
                                    />
                                    <p className="activeType">Drinknamn</p>
                                </>
                            ) : (
                                <>
                                    {" "}
                                    <img
                                        src={cocktail}
                                        alt="ingredients without color"
                                        height="100px"
                                        width="100px"
                                    />
                                    <p>Drinknamn</p>
                                </>
                            )}
                        </div>
                        <div
                            className="typeSelection"
                            onClick={() => setType("ingredientname")}
                        >
                            {type === "ingredientname" ? (
                                <>
                                    {" "}
                                    <img
                                        src={ingredientsColor}
                                        alt="cocktail glass with color"
                                        height="100px"
                                        width="100px"
                                    />
                                    <p className="activeType">Ingrediens</p>
                                </>
                            ) : (
                                <>
                                    {" "}
                                    <img
                                        src={ingredients}
                                        alt="cocktail glass without color"
                                        height="100px"
                                        width="100px"
                                    />
                                    <p>Ingrediens</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="searchDrinksContainer">
                    {searchedDrinks &&
                        searchedDrinks
                            .filter((drink) => {
                                if (searchValue === "") {
                                    return null;
                                } else if (
                                    type === "ingredientname" &&
                                    drink.ingredients
                                        .toString()
                                        .toLowerCase()
                                        .includes(searchValue.toLowerCase())
                                ) {
                                    return drink;
                                } else if (
                                    type === "drinkname" &&
                                    drink.name
                                        .toLowerCase()
                                        .includes(searchValue.toLowerCase())
                                ) {
                                    return drink;
                                }
                            })
                            .map((drink, key) => {
                                return (
                                    <div
                                        className="searchDrinkCard"
                                        key={key}
                                        onClick={() =>
                                            navigate(`/drink/${drink.docId}`)
                                        }
                                    >
                                        <h3 className="searchName">
                                            {" "}
                                            {drink.name}
                                        </h3>
                                        <div className="searchInfo">
                                            <div className="searchIngredients">
                                                {drink.ingredients.map(
                                                    ((ingredient, i) => (
                                                        <p key={i}>{ingredient}</p>
                                                    )
                                                ))}
                                            </div>

                                            <div className="searchImage">
                                                <img
                                                    alt="drink"
                                                    src={`${
                                                        drink.image_src ===
                                                        "https://drinkoteket.se/wp-content/uploads/missing-img-2.jpg"
                                                            ? ImageMissing
                                                            : drink.image_src
                                                    }`}
                                                    height="100%"
                                                    width="100%"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
