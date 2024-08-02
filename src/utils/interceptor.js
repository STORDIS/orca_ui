import axios from "axios";
import axiosRetry from "axios-retry";
import secureLocalStorage from "react-secure-storage";

const interceptor = (retryCount = 4, retryDelay = 3000) => {
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

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.code === "ERR_NETWORK") {
                alert("Connection timed out. Please try again.");
            } else if (
                error.response &&
                error.response.statusText === "Unauthorized" &&
                error.response.status === 401
            ) {
                alert("Invalid Token");
                secureLocalStorage.clear();
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );

    axiosRetry(instance, {
        retries: retryCount,
        retryDelay: (retryCount) => {
            return retryDelay;
        },
        retryCondition: (error) => {
            // retry on network errors or 5xx errors
            return (
                axiosRetry.isNetworkError(error) ||
                axiosRetry.isRetryableError(error)
            );
        },
    });

    return instance;
};

export default interceptor;
