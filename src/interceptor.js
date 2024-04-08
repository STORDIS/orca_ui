import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const interceptor = () => {

    const instance = axios.create({
        headers: {
            "Content-Type": "application/json",
        },
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

    return instance;
};

export default interceptor;
