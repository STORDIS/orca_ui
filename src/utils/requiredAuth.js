import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import secureLocalStorage from "react-secure-storage";

export const RequireAuth = ({ children }) => {
    const location = useLocation();
    const auth = useAuth();
    if (!secureLocalStorage.getItem("token")) {
        console.log("here", location.pathname);
        let targetUrl = "/login?redirect=" + btoa(location.pathname);
        return (
            <Navigate to={targetUrl || "/login"} state={{ from: location }} />
        );
    }
    return children;
};

export default RequireAuth;
