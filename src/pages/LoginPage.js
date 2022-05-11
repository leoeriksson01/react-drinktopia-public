import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPageStyle.scss";
import { useAuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
    const { login, forgotPassword  } = useAuthContext();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate("/");
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    const forgotPasswordHandler = () => {
        const email = emailRef.current.value;
        if (email)
        console.log("test")
          forgotPassword(email).then(() => {
            emailRef.current.value = "";
          });
      };

    return (
        <div className="loginContainer">
            <div className="logInText">
                {" "}
                <h2> Logga In</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                </Form.Group>

                <Form.Group id="password" className="mb-3">
                    <Form.Label>Lösenord</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>

                <Button className="authButton" disabled={loading} type="submit">
                    Logga In
                </Button>
            </Form>

            <div className="text-center mt-3">
                Behöver du ett konto? <Link to="/signup">Registrera dig</Link>
            </div>
            <p className="forgotPassword" onClick={() => navigate("/resetpassword")}>Glömt lösenord?</p>
        </div>
    );
};

export default LoginPage;
