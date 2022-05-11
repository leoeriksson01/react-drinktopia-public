/* import { useContext, useEffect, useState, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import "../styles/ProfilePageStyle.scss";
import { Form, Alert } from "react-bootstrap";
import { updateEmail, updateProfile, updatePassword } from "firebase/auth";
import { useForm } from "react-hook-form";

const EditUser = () => {
    const { currentUser } = useAuthContext();
    const [displayName, setDisplayName] = useState("");
    const { statusMsg, setStatusMsg } = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        setDisplayName(currentUser.displayName);
        setEmail(currentUser.email);
    }, [currentUser]);

    const { handleSubmit } = useForm();

    const onSubmit = async (data, e) => {
        e.preventDefault();
        data.name !== currentUser.displayName &&
            updateProfile(currentUser, {
                displayName: displayName,
            });

        email !== currentUser.email && updateEmail(currentUser, email);
        displayName !== currentUser.name &&
            email !== currentUser.email &&
            updateProfile(currentUser, {
                displayName: displayName,
            }).then(() => {
                updateEmail(currentUser, email);
            });
    };
    return (
        <div className="addRecipeContainer">
            <p>
                {" "}
                För att redigera email och lösenord krävs det att man nyligen
                har loggat in. Vid redigering av email kommer du bli utloggad
                och får logga in med den nya emailen.
            </p>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="formRow">
                    <input
                        defaultValue={displayName}
                        className="customFormGroup"
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Ditt namn"
                    />

                    <input
                        className="customFormGroup"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Din email"
                    />
                </div>
                <button type="submit" className="updateButton">
                    Spara
                </button>
                {statusMsg ? (
                    <Alert variant={statusMsg.type}> {statusMsg} </Alert>
                ) : (
                    ""
                )}
            </Form>
        </div>
    );
};

export default EditUser;
 */