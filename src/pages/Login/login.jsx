import { useState, useEffect } from "react";
import { useAuth } from "../../utils/auth";
import "./login.scss";
import logo from "../../assets/orca.png";
import secureLocalStorage from "react-secure-storage";

import { useLocation, useNavigate } from "react-router-dom";

export const Login = () => {
    const auth = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const queryParams = new URLSearchParams(location.search);
        const param = queryParams.get("redirect");
        console.log(param);

        auth.login(formData, atob(param));
    };

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // auto login
        if (secureLocalStorage.getItem("token")) {
            console.log("auto login", location.pathname);
            window.location.href = "/home";
        }
    }, []);

    return (
        <div className="main-card">
            <img
                src={logo}
                className="logo"
                style={{ marginBottom: "10px" }}
                alt="logo"
            />
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <div>
                    <button className="btnStyle" type="submit">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
