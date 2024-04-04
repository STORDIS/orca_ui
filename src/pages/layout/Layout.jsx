import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useLocation, useNavigate } from "react-router-dom";

import RequireAuth from "../../utils/requiredAuth.js";

import Home from "../home/Home.jsx";
import ErrorPage from "../error/errorPage.jsx";
import Login from "../Login/login.jsx";
import TabbedPane from "../../components/tabbedpane/TabbedPane.jsx";
import LogViewer from "../../components/logpane/logpane.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import { DataProvider } from "../../LogContext.js";
import OrcAsk from "../orcask/orcAsk.jsx"

import "./Layout.scss";

const Layout = () => {
    const [token, setToken] = useState("");
    const [isAI, setIsAI] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname.includes("/askOrca")) {
            setIsAI(false);
        } else {
            setIsAI(true);
        }

        // auto login
        // if (secureLocalStorage.getItem("token") && location.pathname === '/login' ) {
        //     console.log("auto login", location.pathname);
        //     navigate('/home');
        // }

        setToken(secureLocalStorage.getItem("token"));
    }, [location.pathname, token]);

    return (
        <div className="mainContainer">
            {token ? <Sidebar /> : null}

            <DataProvider>
                <div className="container">
                    {token ? <Navbar /> : null}
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/home"
                            element={
                                <RequireAuth>
                                    <Home />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/orcAsk"
                            element={
                                <RequireAuth>
                                    <OrcAsk />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="devices/:deviceIP"
                            element={
                                <RequireAuth>
                                    <TabbedPane />
                                </RequireAuth>
                            }
                        />
                        {/* <Route
                            path="/"
                            element={<Navigate replace to="/login" />}
                        /> */}
                        <Route path="/" element={<Redirect />} />

                        <Route path="*" element={<ErrorPage />} />
                    </Routes>

                    {token && isAI ? (
                        <div className="listContainer">
                            <LogViewer />
                        </div>
                    ) : null}
                </div>
            </DataProvider>
        </div>
    );
};

function Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        // console.log('location.pathname',location.pathname)

        if (secureLocalStorage.getItem("token")) {
            navigate("/home");
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return null;
}
export default Layout;
