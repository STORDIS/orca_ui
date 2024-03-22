import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import { AuthProvider } from "./utils/auth";
import "./App.scss";
import Layout from "./pages/layout/Layout.jsx";

const App = () => {
    useEffect(() => {}, []);

    return (
        <AuthProvider>
            <Router>
                <Layout />
            </Router>
        </AuthProvider>
    );
};

export default App;
