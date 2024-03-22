import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import RequireAuth from "../../utils/requiredAuth.js";

import Home from "../home/Home.jsx";
import ErrorPage from "../error/errorPage.jsx";
import { Login } from "../Login/login.jsx";
import AskOrca from "../askorca/Askorca.jsx";

import TabbedPane from "../../components/tabbedpane/TabbedPane.jsx";
import LogViewer from "../../components/logpane/logpane.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import { DataProvider } from "../../LogContext.js";

import "./Layout.scss";

import { useLocation } from "react-router-dom";

const Layout = () => {
    const [token, setToken] = useState("");
    const [isAI, setIsAI] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/askOrca")) {
            setIsAI(false);
        } else {
            setIsAI(true);
        }

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
                            path="devices/:deviceIP"
                            element={
                                <RequireAuth>
                                    <TabbedPane />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/askOrca"
                            element={
                                <RequireAuth>
                                    <AskOrca />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/"
                            element={<Navigate replace to="/login" />}
                        />
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

export default Layout;
