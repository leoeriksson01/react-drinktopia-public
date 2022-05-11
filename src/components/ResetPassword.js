import React, { useRef, useState } from "react";

import { Form, Button, Alert } from "react-bootstrap";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { forgotPassword } = useAuthContext();


    const forgotPasswordHandler = () => {
        const email = emailRef.current.value;
        if (email)
            forgotPassword(email).then(() => {
                emailRef.current.value = "";
                toast.success(
                    "Mailet är skickat, du omdirigeras nu till inloggningssidan",  {
                        duration: 3000,
                    }
                );

                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            });

        if (!email) {
            setError("Du måste ange en giltig email");
        }
    };

    const emailRef = useRef();
    return (
        <div className="loginContainer">
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="logInText">
                {" "}
                <h2> Glömt lösenord</h2>
            </div>
            <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} />
            </Form.Group>

            <Button className="authButton" onClick={forgotPasswordHandler}>
                Skicka mail
            </Button>

            <p></p>
        </div>
    );
};

export default ResetPassword;
