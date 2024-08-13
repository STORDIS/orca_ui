import React from "react";
import "./error.scss";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    return (
        <div className="errorPageContainer">
            {queryParams.get("message") === "ERR_NETWORK" ? (
                <div className="listTitle">
                    Could not connect to the server ! Make sure orca_backend is running and for orca_ui environment variable is set: REACT_APP_HOST_ADDR_BACKEND="http://orca_backend_ip:port.
                </div>
            ) : (
                <div className="listTitle"> PAGE NOT FOUND</div> // This is the else case
            )}
        </div>
    );
};

export default ErrorPage;
