import Home from "./pages/home/Home";
import TabbedPane from "./components/tabbedpane/TabbedPane";
import LogViewer from "./components/logpane/logpane";
import { useState } from "react";
import "./pages/home/home.scss";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  const [log, setLog] = useState([]);

  const getLogViewer = () => {
    return (
      <div className="listContainer">
        <div className="listTitle">Logs</div>
        <LogViewer log={log} setLog={setLog} />
      </div>
    );
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home logViewer={getLogViewer()} setLog={setLog} />} />
            <Route path="devices">
              <Route
                path=":deviceIP"
                element={<TabbedPane logViewer={getLogViewer()} setLog={setLog} />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
