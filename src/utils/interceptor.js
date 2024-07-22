import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const interceptor = () => {
    const instance = axios.create({
        headers: {
            "Content-Type": "application/json",
        },
        // timeout: 20000, // 20 seconds.
    });

    instance.interceptors.request.use(
        (config) => {
            const token = secureLocalStorage.getItem("token");
            if (token) {
                config.headers.Authorization = "Token " + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.code === "ERR_NETWORK") {
                alert("Connection timed out. Please try again.");
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default interceptor;
