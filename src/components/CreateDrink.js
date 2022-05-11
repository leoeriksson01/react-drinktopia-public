import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { useAuthContext } from "../contexts/AuthContext";

import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { produce } from "immer";
import { Form, Alert } from "react-bootstrap";

function CreateDrink() {
    const { statusMsg, setStatusMsg } = useState("");
    const storage = getStorage();
    const fns = require("date-fns");
    const { currentUser } = useAuthContext();
    const [ingredients, setIngredients] = useState([""]);
 
    const { register, handleSubmit, reset } = useForm({
    });


    const onSubmit = async (data, e) => {
        e.preventDefault();

        // Skapa ett random id
        let min = Math.ceil(1);
        let max = Math.floor(999999);
        const randomId = Math.floor(Math.random() * (max - min) + min);
        const currentDate = Date.now();
        const documentID = randomId + currentDate;

        const currentTime = fns.format(new Date(), "yyyy-MM-dd HH:mm");

        const file = data.image[0];
        const storageRef = ref(storage, "images/" + data.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    addDoc(collection(db, "drinks"), {
                        accepted: false,
                        created_by: currentUser.displayName,
                        created_at: currentTime,
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
                });
            }
        );
        reset();
    };

    return (
        <div className="addRecipeContainer">
            <h3> Lägg till recept </h3>
            <p>
                {" "}
                Alla fälten är obligatoriska och receptet måste godkännas för
                att synas på andra delar av sidan
            </p>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="formRow">
                <div className="inputWrapper">
                    <label>Namn</label>
                    <input
                        className="customFormGroup"
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
                        <option value="">Kategory...</option>
                        <option value="Gindrinkar">Gindrinkar</option>
                        <option value="Whiskeydrinkar">Whiskeydrinkar</option>
                        <option value="Likördrinkar">Likördrinkar</option>
                        <option value="Vodkadrinkar">Vodkadrinkar</option>
                        <option value="Tequiladrinkar">Tequiladrinkar</option>
                        <option value="Romdrinkar">Romdrinkar</option>
                    </select>
                </div>
                </div>

                <div className="formRow">
                <div className="inputWrapper">
                <label>Beskrivning</label>
                    <textarea
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
                                            value={p.ingredient}
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
                                    {
                                        ingredient: ""
                                    },
                                ]);
                            }}
                        >
                            Fler ingredienser
                        </div>

                <div className="uploadFile">
                    {" "}
                    <p>Lägg upp bild </p>
                </div>
                <input
                    {...register("image", {
                        required: true,
                    })}
                    type="file"
                ></input>

                <button type="submit" className="updateButton">
                    Publicera recept
                </button>
                {statusMsg ? (
                    <Alert variant={statusMsg.type}> {statusMsg} </Alert>
                ) : (
                    ""
                )}
            </Form>
        </div>
    );
}

export default CreateDrink;
