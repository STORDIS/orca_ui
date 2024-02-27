import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import secureLocalStorage from "react-secure-storage";

export const RequireAuth = ({ children }) => {
    const location = useLocation();
    const auth = useAuth();
    if (!secureLocalStorage.getItem("access_token")) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
};

export default RequireAuth;
