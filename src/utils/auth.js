import { useState, createContext, useContext } from "react";
import secureLocalStorage from "react-secure-storage";

import interceptor from "../interceptor";

import { postLogin } from "../backend_rest_urls";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const instance = interceptor();

    const login = async (credential) => {
        /* 
            this is hard coded values when apis are ready we can remove this 
            And un comment the below cemented api call 
        */
        if (
            credential.username === "orca" &&
            credential.password === "test@123"
        ) {
            setAccessToken(credential);
            secureLocalStorage.setItem("access_token", credential.password);
            window.location.href = "/home";
        } else {
            alert("Invalid credential");
            secureLocalStorage.clear();
        }

        // api call to get credentials
        
        // await instance
        //     .post(postLogin(), credential)
        //     .then((response) => {
        //         secureLocalStorage.setItem(
        //             "access_token",
        //             response.data.access_token
        //         );
        //         secureLocalStorage.setItem("access_token", credential);
        //         setAccessToken(credential);
        //         console.log("here");
        //         window.location.href = "/home";
        //     })
        //     .catch((error) => {
        //         console.error("Error:", error);
        //         secureLocalStorage.clear();
        //         alert("Invalid credential");
        //     });
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
