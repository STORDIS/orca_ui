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

    console.log(theme);

    const root = document.documentElement;

    if (theme === null) {
      secureLocalStorage.setItem("theme", "dark");
    } else if (theme === "dark") {
      root.style.setProperty("--bg_color", "rgba(13, 17, 23, 1)");
      root.style.setProperty("--text_color", "rgba(255, 255, 255, 0.75)");
      root.style.setProperty("--title", "rgba(255, 255, 255, 1)");
      root.style.setProperty("--form_border", "rgba(255, 255, 255, 0.5)");
      root.style.setProperty("--backdrop", "rgba(255, 255, 255, 0.1)");

      root.style.setProperty("--btn_bg", "rgba(1, 4, 9, 1)");
      root.style.setProperty("--btn_color", "rgba(255, 255, 255, 1)");
      root.style.setProperty("--btn_border", "rgba(255, 255, 255, 0.5)");

      root.style.setProperty("--btn_disabled_bg", "rgba(22, 27, 34, 1)");
      root.style.setProperty("--btn_disabled_border", "rgba(1, 4, 9, 1)");
      root.style.setProperty(
        "--btn_disabled_color",
        "rgba(255, 255, 255, 0.3)"
      );

      root.style.setProperty("--item_color", "rgba(22, 27, 34, 1)");
      root.style.setProperty("--item_hover", "rgba(33, 150, 243, 0.1)");
      root.style.setProperty("--item_hover_border", "rgba(255, 255, 255, 0.1)");

      root.style.setProperty("--input_bg", "rgba(1, 4, 9, 1)");
      root.style.setProperty("--input_color", "rgba(255, 255, 255, 1)");
      root.style.setProperty("--text_editor_bg", "rgba(30, 30, 30, 1)");

      root.style.setProperty("--card_bg", "rgba(1, 4, 9, 1)");

      root.style.setProperty("--scrollbar_color", "rgba(255, 255, 255, 0.25)");
      root.style.setProperty("--tab_active_bg", "rgba(30, 30, 30, 1)");
      root.style.setProperty("--graph_bg", "rgba(255, 255, 255, 0.1)");
    } else {
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
