import Home from "./pages/home/Home";
import List from "./pages/list/List";
import TabbedPane from "./components/tabbedpane/TabbedPane";
import Discover from "./pages/discover/discover";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="devices" >
              <Route index element={<List />} />
              <Route path=":deviceIP" element={<TabbedPane />} />
            </Route>
            <Route path="discover" element={<Discover />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
