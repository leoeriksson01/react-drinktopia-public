import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import "../styles/LoginPageStyle.scss";

const SignupPage = () => {
    const emailRef = useRef();
    const nameRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuthContext();
    const navigate = useNavigate();
    const { setName } = useAuthContext();

    const nameInput = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Lösenorden stämmer inte överens");
        }
        setError(null);
        try {
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);

            navigate("/");
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    return (
        <div className="loginContainer">
            <div className="logInText">
                {" "}
                <h2> Registera konto</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group id="name" className="mb-3">
                    <Form.Label>För och Efternamn</Form.Label>
                    <Form.Control
                        type="name"
                        onChange={nameInput}
                        ref={nameRef}
                        required
                    />
                </Form.Group>

                <Form.Group id="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                </Form.Group>

                <Form.Group id="password" className="mb-3">
                    <Form.Label>Lösenord</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>

                <Form.Group id="password-confirm" className="mb-3">
                    <Form.Label>Bekräfta Lösenord</Form.Label>
                    <Form.Control
                        type="password"
                        ref={passwordConfirmRef}
                        required
                    />
                </Form.Group>

                <Button className="authButton" disabled={loading} type="submit">
                    Skapa konto
                </Button>
            </Form>

            <div className="text-center mt-3">
                Har du redan ett konto? <Link to="/login">Logga in</Link>
            </div>
        </div>
    );
};

export default SignupPage;
