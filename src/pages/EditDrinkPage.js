import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import {
    getStorage,
    uploadBytesResumable,
    getDownloadURL,
    ref,
} from "firebase/storage";
import { Form, Alert } from "react-bootstrap";
import { produce } from "immer";
import toast from "react-hot-toast";

const EditDrinkPage = () => {
    const { id } = useParams();
    const [ingredients, setIngredients] = useState([]);

    const drinkref = doc(db, "drinks", id);

    const product = useFirestoreDocument(["drinks", id], drinkref, {
        includeMetadataChanges: true,
        idField: "_id",
    });

    const snapshot = product?.data;
    const drink = snapshot?.data();

    useEffect(() => {
        setIngredients(drink?.ingredients);
    }, [snapshot]);

    const { statusMsg, setStatusMsg } = useState("");
    const storage = getStorage();
    const fns = require("date-fns");
    const { currentUser } = useAuthContext();
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data, e) => {
        e.preventDefault();

        // Skapa ett random id
        let min = Math.ceil(1);
        let max = Math.floor(999999);
        const randomId = Math.floor(Math.random() * (max - min) + min);
        const currentDate = Date.now();
        const documentID = randomId + currentDate;

        const currentTime = fns.format(new Date(), "yyyy-MM-dd HH:mm");

        if (data?.image?.length > 0) {
            const file = data?.image[0];
            const storageRef = ref(storage, "images/" + data?.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    switch (snapshot.state) {
                        case "paused":
                            break;
                        case "running":
                            break;
                    }
                },
                (error) => {
                    setStatusMsg(error);
                    switch (error.code) {
                        case "storage/unauthorized":
                            break;
                        case "storage/canceled":
                            break;
                        case "storage/unknown":
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            updateDoc(drinkref, {
                                accepted: false,
                                created_by: currentUser.displayName,
                                updated_at: currentTime,
                                creator_uid: currentUser.uid,
                                image_src: downloadURL,
                                ingredients,
                                instructions: data.instructions,
                                category: data.category,
                                name: data.name,
                                description: data.description,
                                id: documentID,
                                timestamp: serverTimestamp(),
                            });
                        }
                    );
                }
            );
        }

        console.log(data?.image.length);

        if (data.image.length <= 0) {
            updateDoc(drinkref, {
                accepted: false,
                created_by: currentUser.displayName,
                updated_at: currentTime,
                creator_uid: currentUser.uid,
                image_src: drink.image_src,
                ingredients,
                instructions: data.instructions,
                category: data.category,
                name: data.name,
                description: data.description,
                id: documentID,
                timestamp: serverTimestamp(),
            });
        }
        toast.success("Dokumentet har blivit uppdaterat");
        reset();
    };

    return (
        <div className="editPageContainer"> 
        <div className="addRecipeContainer">
            {drink && drink?.creator_uid === currentUser?.uid ? (
                <>
                    <h3> Redigera recept </h3>
                    <p>
                        {" "}
                        Alla fälten är obligatoriska och receptet måste
                        godkännas för att synas på andra delar av sidan
                    </p>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="formRow">
                            <div className="inputWrapper">
                                <label>Namn</label>
                                <input
                                    defaultValue={drink?.name}
                                    className="customFormGroup"
                                    name="name"
                                    {...register("name", {
                                        required: true,
                                    })}
                                    placeholder="Drinkens namn"
                                />
                            </div>

                            <div className="inputWrapper">
                                <label>Kategory</label>
                                <select
                                    className="customFormGroup"
                                    {...register("category", {
                                        required: true,
                                    })}
                                >
                                    <option value={`${drink?.category}`}>
                                        {drink?.category}
                                    </option>
                                    <option value="Gindrinkar">
                                        Gindrinkar
                                    </option>
                                    <option value="Whiskeydrinkar">
                                        Whiskeydrinkar
                                    </option>
                                    <option value="Likördrinkar">
                                        Likördrinkar
                                    </option>
                                    <option value="Vodkadrinkar">
                                        Vodkadrinkar
                                    </option>
                                    <option value="Tequiladrinkar">
                                        Tequiladrinkar
                                    </option>
                                    <option value="Romdrinkar">
                                        Romdrinkar
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="formRow">
                            <div className="inputWrapper">
                                <label>Beskrivning</label>
                                <textarea
                                    defaultValue={drink?.description}
                                    className="customFormGroup"
                                    {...register("description", {
                                        required: true,
                                    })}
                                    placeholder="Beskrivning"
                                />
                            </div>
                            <div className="inputWrapper">
                                <label>Instruktioner</label>
                                <textarea
                                    className="customFormGroup"
                                    defaultValue={drink?.instructions}
                                    {...register("instructions", {
                                        required: true,
                                    })}
                                    placeholder="Instruktioner"
                                />
                            </div>
                        </div>

                        <label>Ingredienser</label>
                        <ul className="ingredientsList">
                            {ingredients?.map((p, index) => {
                                return (
                                    <li key={index}>
                                        <input
                                            className="customFormGroup"
                                            onChange={(e) => {
                                                const ingredient =
                                                    e.target.value;
                                                setIngredients(
                                                    (currentIngredient) =>
                                                        produce(
                                                            currentIngredient,
                                                            (v) => {
                                                                v[index] =
                                                                    ingredient;
                                                            }
                                                        )
                                                );
                                            }}
                                            value={p}
                                            placeholder="ingredient"
                                        />
                                        <span
                                            className="deleteButton"
                                            onClick={() => {
                                                setIngredients(
                                                    (currentIngredient) =>
                                                        currentIngredient.filter(
                                                            (x) => x !== p
                                                        )
                                                );
                                            }}
                                        >
                                            X
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                        <div
                            className="appendButton"
                            onClick={() => {
                                setIngredients((currentIngredient) => [
                                    ...currentIngredient,

                                    "",
                                ]);
                            }}
                        >
                            Fler ingredienser
                        </div>
                        <div className="uploadFile">
                            {" "}
                            <p>Lägg upp bild </p>
                        </div>
                        <input {...register("image", {})} type="file"></input>

                        <br />
                        <div className="uploadedImage">
                            <label>Gammal Bild</label>

                            {drink?.image_src && (
                                <img
                                    src={drink?.image_src}
                                    alt="drink"
                                    width="50%"
                                />
                            )}
                        </div>

                        <button type="submit" className="updateButton">
                            Uppdatera recept
                        </button>
                        {statusMsg ? (
                            <Alert variant={statusMsg.type}>
                                {" "}
                                {statusMsg}{" "}
                            </Alert>
                        ) : (
                            ""
                        )}
                    </Form>
                </>
            ) : (
                <h1> Du har inte tillgång att redigera detta dokumentet. </h1>
            )}
        </div>
        </div>
    );
};

export default EditDrinkPage;
