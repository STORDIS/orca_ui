// interceptor.js
import axios from "axios";
import axiosRetry from "axios-retry";
import secureLocalStorage from "react-secure-storage";
import { getNavigate } from "./NavigationService";

const interceptor = (
    retryCount = 1, // number of retries. There will be a total of +1 retryCount API calls from the browser to the backend
    retryDelay = 2000 // retry delay in milliseconds, 1000 = 1 sec
) => {
    const navigate = getNavigate();

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
            const config = error.config;
            if (
                error.response &&
                error.response.statusText === "Unauthorized" &&
                error.response.status === 401
            ) {
                alert("Invalid Token");
                secureLocalStorage.clear();
                navigate("/login");
                // window.location.href = "/login";
            } else if (
                config &&
                config.__retryCount >= retryCount &&
                error.code === "ERR_NETWORK"
            ) {
                navigate("/error?message=ERR_NETWORK");
            }
            return Promise.reject(error);
        }
    );

    axiosRetry(instance, {
        retries: retryCount,
        retryDelay: () => retryDelay,
        retryCondition: (error) => {
            // Retry only for network errors
            return (
                axiosRetry.isNetworkError(error) && error.code === "ERR_NETWORK"
            );
        },
        onRetry: (retryCount, error, requestConfig) => {
            requestConfig.__retryCount = retryCount;
        },
    });

    return instance;
};

export default interceptor;
