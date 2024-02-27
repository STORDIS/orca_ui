import { useState, createContext, useContext } from "react";
import secureLocalStorage from "react-secure-storage";

import interceptor from "../interceptor";

import { postLogin } from "../backend_rest_urls";

import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [credential, setCredential] = useState(null);
    const instance = interceptor();

    const isLoggedIn = async (credential) => {
        console.log("login");
    };

    const logout = () => {
        setCredential(null);
        secureLocalStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ credential, isLoggedIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
