import axios from "axios";
import axiosRetry from "axios-retry";
import secureLocalStorage from "react-secure-storage";

const interceptor = (
    retryCount = 4, // number of retries. There will be total +1 of retryCount api calls from browser to backend
    retryDelay = 3000 // retry delay in mill seconds, 1000 = 1 sec
) => {
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
