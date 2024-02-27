import { useState, createContext, useContext } from "react";
import secureLocalStorage from "react-secure-storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [credential, setCredential] = useState(null);

    const login = (credential) => {
        if (credential.name === "admin" && credential.password === "admin") {
            setCredential(credential);
            secureLocalStorage.setItem("credential", credential);
        } else {
            alert("Invalid credential");
            // secureLocalStorage.clear();
        }
    };

    const logout = () => {
        setCredential(null);
        secureLocalStorage.clear();
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
