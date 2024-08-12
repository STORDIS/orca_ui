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
                    Connection timed out. Please try again.
                </div>
            ) : (
                <div className="listTitle"> PAGE NOT FOUND</div> // This is the else case
            )}
        </div>
    );
};

export default ErrorPage;
