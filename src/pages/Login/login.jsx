import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import secureLocalStorage from "react-secure-storage";
import "./login.scss";
import logo from "../../assets/orca.png";

export const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    const redirectPath = location.state?.path || "/";

    const handleLogin = () => {
        const credentials = {
            name: userName,
            password: password,
        };
        auth.login(credentials);
        window.location.href = "/home";
        // navigate(redirectPath, { replace: true });
    };

    useEffect(() => {
        // auto login
        if (secureLocalStorage.getItem("credential")) {
            auth.login(secureLocalStorage.getItem("credential"));
            navigate(redirectPath, { replace: true });
        }
    }, []);

    return (
        <div className="main-card">
            <img src={logo} className="logo" style={{ marginBottom: "10px" }} />
            <form action="#">
                <h1>Login</h1>
                <div className="mb-3">
                    <label className="">User Name </label>
                    <input
                        type="text"
                        className=""
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="mb-5">
                    <label className="">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="showBtn"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <span class="material-symbols-outlined">
                                visibility
                            </span>
                        ) : (
                            <span class="material-symbols-outlined">
                                visibility_off
                            </span>
                        )}
                    </button>
                </div>

                <div className="">
                    <button
                        onClick={handleLogin}
                        type="submit"
                        className="btnDiscovery"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
