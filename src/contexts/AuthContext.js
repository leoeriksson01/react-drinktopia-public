import React, { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
} from "firebase/auth";
import { PulseLoader } from "react-spinners";
import { auth } from "../firebase";

const AuthContext = createContext();

const useAuthContext = () => {
    return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");

    const signup = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password).then(
            (user) => {
                updateProfile(user.user, {
                    displayName: name,
                });
            }
        );
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

    const forgotPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
      };

    const contextValues = {
        currentUser,
        loading,
        login,
        logout,
        signup,
        setName,
        forgotPassword,
    };

    return (
        <AuthContext.Provider value={contextValues}>
            {loading && (
                <div id="spinner">
                    <PulseLoader color={"#f6a017"} size={30} margin={4} />
                </div>
            )}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { useAuthContext, AuthContextProvider as default };
