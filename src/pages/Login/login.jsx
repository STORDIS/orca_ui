import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import secureLocalStorage from "react-secure-storage";
import "./login.scss";
import logo from "../../assets/orca.png";

import interceptor from "../../interceptor";
import { postLogin } from "../../backend_rest_urls";
import axios from "axios";

export const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    const redirectPath = location.state?.path || "/";

    const instance = interceptor();

    const handleLogin = async () => {
        const credentials = {
            username: userName,
            password: password,
        };

        try {
            const response = await axios.post(postLogin(), credentials);
            console.log(response.data.access_token);
            // secureLocalStorage.setItem("credential", credential);
            // console.log(
            //     "here",
            //     secureLocalStorage.getItem("credential").username
            // );

            // window.location.href = "/home";
        } catch (error) {
            console.log(error);
        }

        // await instance
        //     .post(postLogin(), credentials)
        //     .then((response) => {
        //         console.log("Response:", response.data.access_token);
        //         // secureLocalStorage.setItem(
        //         //     "access_token",
        //         //     response.data.access_token
        //         // );

        //         console.log("here");
        //     })
        //     .catch((error) => {
        //         console.error("Error:", error);
        //         alert("Invalid credential");
        //     });

        // navigate(redirectPath, { replace: true });
    };

    useEffect(() => {}, []);

    return (
        <div className="main-card">
            <img src={logo} className="logo" style={{ marginBottom: "10px" }} />
            <form action="#">
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
            </form>
        </div>
    );
};

export default Login;
