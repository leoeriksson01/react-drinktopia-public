import React from "react";
import "../styles/CategoriesPageStyle.scss";
import { useNavigate } from "react-router-dom";
import gindrinks from "../assets/gindrinks.jpg";
import vodkadrinks from "../assets/vodkadrinks.png";
import whiskeydrinks from "../assets/whiskeydrinks.png";
import rumdrinks from "../assets/rumdrinks.png";
import tequiladrinks from "../assets/tequiladrinks.png";
import liqueurdrinks from "../assets/liqueurdrinks.png";

function CategoriesPage() {
    const navigate = useNavigate();

    return (
        <div className="categoriesContainer">
            <div className="categoriesGrid">
                <div
                    className="categoryCard"
                    onClick={() => navigate(`/kategory/Gindrinkar`)}
                >
                    <div className="drinkImage">
                        <img src={gindrinks} width="100%" height="100%" alt="gindrinks" />
                        <div className="imageOverlay"></div>
                    </div>

                    <h3>Gin-drinkar</h3>
                </div>

                <div
                    className="categoryCard"
                    onClick={() => navigate(`/kategory/Whiskeydrinkar`)}
                >
                    <div className="drinkImage">
                        <img src={whiskeydrinks} width="100%" height="100%" alt="whiskeydrinks" />
                        <div className="imageOverlay"></div>
                    </div>

                    <h3>Whiskey-drinkar</h3>
                </div>

                <div
                    className="categoryCard"
                    onClick={() => navigate(`/kategory/Likördrinkar`)}
                >
                    <div className="drinkImage">
                        <img src={liqueurdrinks} width="100%" height="100%" alt="liqueurdrinks" />
                        <div className="imageOverlay"></div>
                    </div>

                    <h3>likör-drinkar</h3>
                </div>

                <div
                    className="categoryCard"
                    onClick={() => navigate(`/kategory/Vodkadrinkar`)}
                >
                    <div className="drinkImage">
                        <img src={vodkadrinks} width="100%" height="100%" alt="vodkadrinks" />
                        <div className="imageOverlay"></div>
                    </div>

                    <h3>Vodka-drinkar</h3>
                </div>

                <div
                    className="categoryCard"
                    onClick={() => navigate(`/kategory/Tequiladrinkar`)}
                >
                    <div className="drinkImage">
                        <img src={tequiladrinks} width="100%" height="100%" alt="tequiladrinks" />
                        <div className="imageOverlay"></div>
                    </div>

                    <h3>tequila-drinkar</h3>
                </div>

                <div
                    className="categoryCard"
                    onClick={() => navigate(`/kategory/Romdrinkar`)}
                >
                    <div className="drinkImage">
                        <img src={rumdrinks} width="100%" height="100%" alt="rumdrinks" />
                        <div className="imageOverlay"></div>
                    </div>

                    <h3>Rom-drinkar</h3>
                </div>
            </div>
        </div>
    );
}

export default CategoriesPage;
