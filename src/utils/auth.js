import { useState, createContext, useContext } from "react";
import secureLocalStorage from "react-secure-storage";
import interceptor from "./interceptor";
import { postLogin, getUserDetailsURL } from "./backend_rest_urls";
import { getNavigate } from "./NavigationService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);

    const instance = interceptor();
    const navigate = getNavigate();

    const login = async (credential, redirectUrl) => {
        await instance
            .post(postLogin(), credential)
            .then((response) => {
                secureLocalStorage.setItem("token", response.data.token);
                setAccessToken(credential);
                getUser(credential.username, redirectUrl);
            })
            .catch((error) => {
                console.log(error);
                if (error.code === "ERR_BAD_RESPONSE") {
                    console.log("1");
                    alert("Invalid credential");
                } else {
                    console.log("2");
                    navigate("/error?message=ERR_NETWORK");
                }

                console.error("Error:", error);
                secureLocalStorage.clear();
            });
    };

    const getUser = async (userName, redirectUrl) => {
        await instance
            .get(getUserDetailsURL(userName))
            .then((response) => {
                secureLocalStorage.setItem("user_details", response.data);
                window.location.href = redirectUrl;
            })
            .catch((error) => {
                console.error("Error:", error);
                secureLocalStorage.clear();
                alert("error");
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
