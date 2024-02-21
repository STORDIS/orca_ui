import Home from "./pages/home/Home";
import TabbedPane from "./components/tabbedpane/TabbedPane";
import LogViewer from "./components/logpane/logpane";
import { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

import { DataProvider } from "./LogContext";

import "./App.scss";

const App = () => {
    // const [log, setLog] = useState([]);

    // const getLogViewer = () => {
    //   return (
    //     <div className="listContainer">
    //       <div className="listTitle">Logs</div>
    //       <LogViewer log={log} setLog={setLog} />
    //     </div>
    //   );
    // };

    return (
        <div className="mainContainer">
            <Router>
                <Sidebar />
                <DataProvider>
                    <div className="container">
                        <Navbar />
                        <Routes>
                            <Route path="/home" element={<Home />} />
                            <Route
                                path="/"
                                element={<Navigate replace to="/home" />}
                            />
                            <Route
                                path="devices/:deviceIP"
                                element={<TabbedPane />}
                            />
                        </Routes>

                        <div className="listContainer">
                            <LogViewer />
                        </div>
                    </div>
                </DataProvider>
            </Router>
        </div>
    );
};

export default App;
