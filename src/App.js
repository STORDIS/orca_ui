import Home from "./pages/home/Home";
import ErrorPage from "./pages/error/errorPage.jsx";

import TabbedPane from "./components/tabbedpane/TabbedPane";
import LogViewer from "./components/logpane/logpane";
import React, { useEffect, useState } from "react";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

import { DataProvider } from "./LogContext";
import { AuthProvider } from "./utils/auth";
import RequireAuth from "./utils/requiredAuth";

import "./App.scss";
import { Login } from "./pages/Login/login.jsx";

import secureLocalStorage from "react-secure-storage";

const App = () => {
    const [token, setToken] = useState("");

    useEffect(() => {
        setToken(secureLocalStorage.getItem("token"));
    }, [token]);

    return (
        <AuthProvider>
            <div className="mainContainer">
                <Router>
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
                                    path="/"
                                    element={<Navigate replace to="/login" />}
                                />

                                <Route path="*" element={<ErrorPage />} />
                            </Routes>

                            {token ? (
                                <div className="listContainer">
                                    <LogViewer />
                                </div>
                            ) : null}
                        </div>
                    </DataProvider>
                </Router>
            </div>
        </AuthProvider>
    );
};

export default App;
