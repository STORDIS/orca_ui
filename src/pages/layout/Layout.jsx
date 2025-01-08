import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ZTPnDHCP from "../ZTPnDHCP/ztpndhcp.jsx";
import Setup from "../setup/setup.jsx";
import { setNavigate } from "../../utils/NavigationService";

import "./Layout.scss";

const Layout = () => {
  const [token, setToken] = useState("");
  const [isAI, setIsAI] = useState(true);
  const location = useLocation();

  const navigate = useNavigate();
  setNavigate(navigate); // Set the navigate function

  useEffect(() => {
    let theme = secureLocalStorage.getItem("theme");

    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--bg_color", "rgb(13, 17, 23)");
      root.style.setProperty("--text_color", "rgb(255, 255, 255)");
      root.style.setProperty("--form_border", "rgba(255, 255, 255, 0.5)");
      root.style.setProperty("--backdrop", "rgba(13, 17, 23, 0.75)");

      root.style.setProperty("--btn_bg", "rgb(1, 4, 9)");
      root.style.setProperty("--btn_color", "rgb(255, 255, 255)");
      root.style.setProperty("--btn_border", "rgba(255, 255, 255, 0.5)");

      root.style.setProperty("--btn_disabled_bg", "rgb(22, 27, 34)");
      root.style.setProperty("--btn_disabled_border", "rgb(1, 4, 9)");
      root.style.setProperty("--btn_disabled_color", "rgba(255, 255, 255, 0.3)");
      
      root.style.setProperty("--item_color", "rgb(22, 27, 34)");
      root.style.setProperty("--item_hover", "rgb(1, 4, 9)");


    }

    if (location.pathname?.includes("/ORCAsk")) {
      setIsAI(false);
    } else if (location.pathname?.includes("/error")) {
      setIsAI(false);
    } else {
      setIsAI(true);
    }

    setToken(secureLocalStorage.getItem("token"));
  }, [location.pathname, token]);

  return (
    <div className="mainContainer">
      {token ? (
        <div className="sideBar">
          <Sidebar />
        </div>
      ) : null}

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
            path="/setup"
            element={
              <RequireAuth>
                <Setup />
              </RequireAuth>
            }
          />
          <Route
            path="/ztpndhcp"
            element={
              <RequireAuth>
                <ZTPnDHCP />
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

        {token && isAI ? <LogViewer /> : null}
      </div>
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
