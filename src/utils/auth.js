import { useState, createContext, useContext } from "react";
import secureLocalStorage from "react-secure-storage";

import interceptor from "../interceptor";

import { postLogin } from "../backend_rest_urls";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);

    const instance = interceptor();

    const login = async (credential, redirectUrl) => {
        await instance
            .post(postLogin(), credential)
            .then((response) => {
                secureLocalStorage.setItem("token", response.data.token);
                setAccessToken(credential);

                console.log("---", redirectUrl);

                // if (redirectUrl) {
                    window.location.href = redirectUrl;
                // } else {
                //     window.location.href = "/home";
                // }
            })
            .catch((error) => {
                console.error("Error:", error);
                secureLocalStorage.clear();
                alert("Invalid credential");
            });
    };

    const logout = () => {
        setAccessToken(null);
        secureLocalStorage.clear();
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
