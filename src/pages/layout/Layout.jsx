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
import OrcAsk from "../orcask/orcAsk.jsx";

// import { DataProvider } from "../../utils/logpannelContext.js";

import { DataProviderLog } from "../../utils/logpannelContext.js";
import { DataProviderConfig } from "../../utils/dissableConfigContext.js";

import "./Layout.scss";

const Layout = () => {
    const [token, setToken] = useState("");
    const [isAI, setIsAI] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/ORCAsk")) {
            setIsAI(false);
        } else {
            setIsAI(true);
        }

        console.log("--", secureLocalStorage.getItem("user_details")?.is_staff);

        setToken(secureLocalStorage.getItem("token"));
    }, [location.pathname, token]);

    return (
        <div className="mainContainer">
            {token ? (
                <div className="sideBar" >
                    <Sidebar />
                </div>
            ) : null}

            <DataProviderLog>
                <div className="container">
                    <DataProviderConfig>
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
                            <Route path="/" element={<Redirect />} />

                            <Route path="*" element={<ErrorPage />} />
                        </Routes>
                    </DataProviderConfig>

                    {token && isAI ? (
                        <div className="listContainer mb resizable">
                            <LogViewer />
                        </div>
                    ) : null}
                </div>
            </DataProviderLog>
        </div>
    );
};

function Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        if (secureLocalStorage.getItem("token")) {
            navigate("/home");
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return null;
}
export default Layout;
