import { useState, createContext, useContext } from "react";
import secureLocalStorage from "react-secure-storage";

import interceptor from "../interceptor";

import { postLogin } from "../backend_rest_urls";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [credential, setCredential] = useState(null);
    const instance = interceptor();

    const login = async (credential) => {
        console.log("login");

        await instance
            .post(postLogin(), credential)
            .then((response) => {
                secureLocalStorage.setItem(
                    "access_token",
                    response.data.access_token
                );
                secureLocalStorage.setItem("credential", credential);
                setCredential(credential);
                console.log("here");
                window.location.href = "/home";
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Invalid credential");
            });
    };

    const logout = () => {
        setCredential(null);
        secureLocalStorage.clear();
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ credential, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
