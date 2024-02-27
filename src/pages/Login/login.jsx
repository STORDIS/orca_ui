import { useState, useEffect } from "react";
import { useAuth } from "../../utils/auth";
import "./login.scss";
import logo from "../../assets/orca.png";

export const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const auth = useAuth();

    const handleLogin = () => {
        const credentials = {
            username: userName,
            password: password,
        };
        auth.login(credentials);
        // navigate(redirectPath, { replace: true });
    };

    useEffect(() => {
        // auto login
        // if (secureLocalStorage.getItem("credential")) {
        //     auth.login(secureLocalStorage.getItem("credential"));
        // }
    }, []);

    return (
        <div className="main-card">
            <img src={logo} className="logo" style={{ marginBottom: "10px" }} alt="logo" />
            <div>
                <h1>Login</h1>
                <div className="">
                    <label className="">User Name </label>
                    <input
                        type="text"
                        className=""
                        placeholder="user name"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="">
                    <label className="">Password</label>
                    <div className="password">
                        <input
                            type={showPassword ? "text" : "password"}
                            className=""
                            value={password}
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="showBtn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <div style={{ display: "flex" }}>
                                {showPassword ? (
                                    <span className="material-symbols-outlined">
                                        visibility
                                    </span>
                                ) : (
                                    <span className="material-symbols-outlined">
                                        visibility_off
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
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
            </div>
        </div>
    );
};

export default Login;
