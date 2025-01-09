import { useState, createContext, useContext } from "react";
import secureLocalStorage from "react-secure-storage";
import interceptor from "./interceptor";
import { postLogin, getUserDetailsURL } from "./backend_rest_urls";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const instance = interceptor();

  const login = async (credential, redirectUrl) => {
    await instance
      .post(postLogin(), credential)
      .then((response) => {
        secureLocalStorage.setItem("token", response.data.token);

        if (secureLocalStorage.getItem("theme") === null) {
          secureLocalStorage.setItem("theme", "light");
        }

        setAccessToken(credential);
        getUser(credential.username, redirectUrl);
      })
      .catch((error) => {
        console.error(error);

        if (error.code === "ERR_NETWORK") {
          window.location.href = "/error?message=ERR_NETWORK";
        } else if (
          error.code === "ERR_BAD_RESPONSE" &&
          error.response.data.message === "User matching query does not exist."
        ) {
          alert("User does not exist");
        } else {
          // alert("Invalid Credentials");
        }

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
    secureLocalStorage.removeItem("token");
    secureLocalStorage.removeItem("user_details");
    // secureLocalStorage.clear();
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
