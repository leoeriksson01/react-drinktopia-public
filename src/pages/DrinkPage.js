import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/DrinkPageStyle.scss";
import { useAuthContext } from "../contexts/AuthContext";
import {
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    collection,
    addDoc,
    query,
    where,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { db } from "../firebase";
import hasliked from "../assets/hasliked.png";
import liked from "../assets/liked.png";
import hasdisliked from "../assets/hasdisliked.png";
import disliked from "../assets/disliked.png";
import linebreaker from "../assets/linebreaker.png";
import Comment from "../components/Comment";
import {
    useFirestoreDocument,
    useFirestoreQueryData,
} from "@react-query-firebase/firestore";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import LinkImage from "../assets/link.png";
import closeicon from "../assets/closeicon.png";

function DrinkPage() {
    const fns = require("date-fns");
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuthContext();
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [copyModalOpen, setCopyModalOpen] = useState(false);

    let location = useLocation();

    const drinkurl = "https://drinktopia-react.vercel.app" + location?.pathname;

    // Hämta drinken via id från params
    const ref = doc(db, "drinks", id);

    const product = useFirestoreDocument(["drinks", id], ref, {
        includeMetadataChanges: true,
        idField: "_id",
    });

    const snapshot = product?.data;
    const drink = snapshot?.data();

    // Hämta kommentarer för drinken

    const queryRef = query(
        collection(db, "comments"),
        where("drink_uid", "==", id)
    );
    const { data: comments } = useFirestoreQueryData(
        ["comments"],
        queryRef,
        {
            idField: "docId",
            subscribe: true,
        },
        {
            refetchOnMount: "always",
        }
    );

    const { register, handleSubmit, reset } = useForm();

    // Find likes and dislikes

    useEffect(
        () =>
            onSnapshot(collection(db, "drinks", id, "dislikes"), (snapshot) =>
                setDislikes(snapshot.docs)
            ),
        [id]
    );

    useEffect(
        () =>
            onSnapshot(collection(db, "drinks", id, "likes"), (snapshot) =>
                setLikes(snapshot.docs)
            ),
        [id]
    );

    useEffect(() => {
        setHasLiked(
            likes.findIndex((like) => like.id === currentUser?.uid) !== -1
        );
    }, [currentUser?.uid, likes]);

    const likeImage = async () => {
        if (hasLiked) {
            await deleteDoc(doc(db, "drinks", id, "likes", currentUser.uid));
        } else {
            if (hasDisliked)
                deleteDoc(doc(db, "drinks", id, "dislikes", currentUser.uid));
            await setDoc(doc(db, "drinks", id, "likes", currentUser.uid), {
                username: currentUser.displayName,
            });
        }
    };

    useEffect(() => {
        setHasDisliked(
            dislikes.findIndex((dislike) => dislike.id === currentUser?.uid) !==
                -1
        );
    }, [currentUser?.uid, dislikes]);

    const dislikeImage = async () => {
        if (hasDisliked) {
            await deleteDoc(doc(db, "drinks", id, "dislikes", currentUser.uid));
        } else {
            if (hasLiked)
                await deleteDoc(
                    doc(db, "drinks", id, "likes", currentUser.uid)
                );
            await setDoc(doc(db, "drinks", id, "dislikes", currentUser.uid), {
                username: currentUser.displayName,
            });
        }
    };

    const onSubmit = async (data, e) => {
        e.preventDefault();

        const currentTime = fns.format(new Date(), "yyyy-MM-dd HH:mm");

        await addDoc(collection(db, "comments"), {
            created_at: currentTime,
            created_by: currentUser.displayName,
            comment: data.comment,
            creator_uid: currentUser.uid,
            drink_uid: id,
        });
        reset();
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(`${drinkurl}`);
        toast.success("Länken är kopierad");
    };
    return (
        <div className="singleDrinkContainer">
            {drink && (
                <>
                    <div>
                        <div className="drinkTop">
                            <h1> {drink?.name} </h1>
                            <h3> {drink?.description} </h3>

                            <div className="cardActions">
                                <div className="cardRatings">
                                    <>
                                        <div>
                                            {hasLiked ? (
                                                <>
                                                    <img
                                                        src={hasliked}
                                                        width="32px"
                                                        height="32px"
                                                        onClick={
                                                            currentUser
                                                                ? likeImage
                                                                : () =>
                                                                      toast.error(
                                                                          "Du måste vara inloggad för att betygsätta en drink"
                                                                      )
                                                        }
                                                        alt="has liked"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <img
                                                        src={liked}
                                                        width="32px"
                                                        height="32px"
                                                        onClick={
                                                            currentUser
                                                                ? likeImage
                                                                : () =>
                                                                      toast.error(
                                                                          "Du måste vara inloggad för att betygsätta en drink"
                                                                      )
                                                        }
                                                        alt="like button"
                                                    />
                                                </>
                                            )}
                                            {likes?.length > 0 ? (
                                                <span> {likes.length} </span>
                                            ) : (
                                                <span> 0 </span>
                                            )}
                                        </div>

                                        <div className="cardDislike">
                                            {hasDisliked ? (
                                                <>
                                                    <img
                                                        src={hasdisliked}
                                                        width="32px"
                                                        height="32px"
                                                        alt="has disliked"
                                                        onClick={
                                                            currentUser
                                                                ? dislikeImage
                                                                : () =>
                                                                      toast.error(
                                                                          "Du måste vara inloggad för att betygsätta en drink"
                                                                      )
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <img
                                                        src={disliked}
                                                        width="32px"
                                                        height="32px"
                                                        alt="dislike button"
                                                        onClick={
                                                            currentUser
                                                                ? dislikeImage
                                                                : () =>
                                                                      toast.error(
                                                                          "Du måste vara inloggad för att betygsätta en drink"
                                                                      )
                                                        }
                                                    />
                                                </>
                                            )}
                                            {dislikes?.length > 0 ? (
                                                <span> {dislikes.length} </span>
                                            ) : (
                                                <span> 0 </span>
                                            )}
                                        </div>
                                    </>
                                </div>
                            </div>

                            <div className="lineBreaker">
                                <img
                                    src={linebreaker}
                                    width="100%"
                                    alt="linebreaker"
                                />
                            </div>
                            <div className="drinkLinks">
                                <p
                                    onClick={() =>
                                        navigate(`/kategory/${drink.category}`)
                                    }
                                >
                                    {" "}
                                    Kategory:{" "}
                                    <span className="underline">
                                        {" "}
                                        {drink.category}{" "}
                                    </span>
                                </p>
                                {drink.created_by ? (
                                    <div>
                                        {drink.creator_uid ? (
                                            <p>
                                                {" "}
                                                Publicerad av:{" "}
                                                <span className="capitalize">
                                                    {" "}
                                                    {drink.created_by}{" "}
                                                </span>{" "}
                                                {drink.created_at
                                                    ? `${drink.created_at}`
                                                    : 2021 - 30 - 11}{" "}
                                            </p>
                                        ) : (
                                            <p>
                                                {" "}
                                                {drink.created_by}{" "}
                                                {drink.created_at
                                                    ? `${drink.created_at}`
                                                    : 2021 - 30 - 11}{" "}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p>
                                        {" "}
                                        Publicerad av: Drinktopia{" "}
                                        {drink.created_at
                                            ? `${drink.created_at}`
                                            : "2021-30-11"}{" "}
                                    </p>
                                )}
                                <div
                                    className="copyUrl"
                                    onClick={() => setCopyModalOpen(true)}
                                >
                                    <img
                                        src={LinkImage}
                                        alt="link"
                                        width="100%"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="drinkInfo">
                            <div className="drinkImageContainer">
                                <img
                                    src={drink?.image_src}
                                    width="100%"
                                    height="100%"
                                    alt="drink"
                                />
                            </div>
                            <div className="drinkMainInfo">
                                <div className="drinkIngredients">
                                    {drink?.ingredients && (
                                        <div>
                                            <h3> Ingredienser </h3>
                                            <ul>
                                                {drink?.ingredients.map(
                                                    (ingredient, i) => (
                                                        <li key={i}>
                                                            {ingredient.ingredient ? (
                                                                <p>
                                                                    {" "}
                                                                    {
                                                                        ingredient.ingredient
                                                                    }{" "}
                                                                </p>
                                                            ) : (
                                                                <p>
                                                                    {" "}
                                                                    {
                                                                        ingredient
                                                                    }{" "}
                                                                </p>
                                                            )}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="drinkInstructions">
                                    {drink.instructions && (
                                        <div>
                                            <h3> Instruktioner </h3>

                                            <ul>
                                                {/* Lägg till mellanrum efter punkt */}
                                                <li>
                                                    {" "}
                                                    <p>
                                                        {" "}
                                                        {drink?.instructions.replace(
                                                            /\.(\S)/g,
                                                            ". $1"
                                                        )}{" "}
                                                    </p>{" "}
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="drinkComments">
                            <h4>
                                {" "}
                                {comments?.length === 0 && "0 Kommentarer"}
                                {comments?.length === 1 && "1 Kommentar"}
                                {comments?.length > 1 &&
                                    comments?.length + " Kommentarer"}
                            </h4>
                            <h2> </h2>
                            {currentUser ? (
                                <div>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <input
                                            className="customFormGroup"
                                            {...register("comment", {
                                                required: true,
                                            })}
                                            placeholder="Lägg till en kommentar"
                                        />
                                        <button
                                            type="submit"
                                            className="authButton"
                                        >
                                            Publicera
                                        </button>
                                    </Form>
                                </div>
                            ) : (
                                "Du måste logga in för att skriva en kommentar"
                            )}
                            {comments && (
                                <div className="commentsSection">
                                    {comments?.map((comment, i) => (
                                        <Comment comment={comment} key={i} />
                                    ))}
                                </div>
                            )}
                        </div>
                        {copyModalOpen && (
                            <div className="linkModal">
                                <img
                                    src={closeicon}
                                    onClick={() => setCopyModalOpen(false)}
                                    className="closeIcon"
                                    width="20"
                                    height="20"
                                    alt="Logo"
                                />
                                <div className="copyLinkWrapper">
                                    <div
                                        className="fakeInput"
                                        onClick={copyUrl}
                                    >
                                        {drinkurl}
                                    </div>
                                    <img
                                        src={LinkImage}
                                        alt="link"
                                        width="20px"
                                        height="20px"
                                        onClick={copyUrl}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default DrinkPage;
