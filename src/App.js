import Home from "./pages/home/Home";
import List from "./pages/list/List";
import TabbedPane from "./pages/tabbedpane/TabbedPane";
import New from "./pages/new/New";
import Interface from "./pages/interface/Interface";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
//import InterfaceTable from "./pages/interface/InterfaceTable";
//import Interface from "./pages/interface/Interface";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            {/* <Route path="login" element={<Login/>}/> */}
            <Route path="devices" >
              {/* <Route path="interfaces" element={<InterfaceTable/>}/>  */}
              <Route path="interfaces" element={<Interface />} />
              <Route index element={<List />} />
              <Route path=":deviceId" element={<TabbedPane />} />
              <Route path="new" element={<New />} />
            </Route>
            <Route path="products">
              <Route index element={<List />} />
              <Route path=":productId" element={<TabbedPane />} />
              <Route path="new" element={<New />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
