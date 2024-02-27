import Home from "./pages/home/Home";
import TabbedPane from "./components/tabbedpane/TabbedPane";
import LogViewer from "./components/logpane/logpane";
import React, { useEffect, useState } from "react";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate,
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
    const [credential, setCredentials] = useState("");

    useEffect(() => {
        setCredentials(secureLocalStorage.getItem("access_token"));
        console.log(credential);
    }, [credential]);

    return (
        <div className="mainContainer">
            <Router>
                {credential ? <Sidebar /> : null}

                <DataProvider>
                    <div className="container">
                        {credential ? <Navbar /> : null}
                        <AuthProvider>
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
                                <Route path="/" element={<Redirect />} />
                            </Routes>
                        </AuthProvider>

                        {credential ? (
                            <div className="listContainer">
                                <LogViewer />
                            </div>
                        ) : null}
                    </div>
                </DataProvider>
            </Router>
        </div>
    );
};

function Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/login?#"); // Add '/#/' before the route
    }, [navigate]);

    return null;
}

export default App;
