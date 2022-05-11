import React, { useState } from "react";
import {
    collection,
    query,
    where,
    limit,
} from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import landingvideo from "../assets/landingvideo.mov";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import "../styles/HomePageStyle.scss";
import DrinkCard from "../components/DrinkCard";

const HomePage = () => {
    const navigate = useNavigate();
    const [playing, setPlaying] = useState(true);

    const queryRef = query(
        collection(db, "drinks"),
        where("accepted", "==", true),
        limit(24)
    );
    const { data } = useFirestoreQueryData(
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

    const getRandomDrink = () => {
        let min = Math.ceil(1);
        let max = Math.floor(289);
        const randomId = Math.floor(Math.random() * (max - min) + min);
        navigate(`/drink/${randomId}`);
    };

    return (
        <div className="homeWrapper">
            <div
                className="player-wrapper"
                onClick={() => setPlaying(!playing)}
            >
                <ReactPlayer
                    className="react-player"
                    url={landingvideo}
                    width="100%"
                    height="100%"
                    loop={true}
                    muted={true}
                    playing={playing}
                />
                <div className="videoOverlay"></div>
                <div className="playerText">
                    <h1> Lär dig att blanda drinkar som ett proffs </h1>
                    <h2> För drinkentusiaster av alla nivåer</h2>
                    <div className="randomBtn" onClick={getRandomDrink}>
                        Se slumpmässig drink
                    </div>
                </div>
            </div>

            {data && (
                <>
                    {data.length && (
                        <div className="grid">
                            {data.map((drink, index) => {
                                return <DrinkCard drink={drink} key={index} />;
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
