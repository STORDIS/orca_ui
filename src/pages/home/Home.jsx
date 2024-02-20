import React, { useState } from "react";
import Datatable from "../../components/tabbedpane/Datatable";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

import "./home.scss";

function Home(props) {
  const [reloadDataTable, setReloadDataTable] = useState(false);

  const handleReloadDeviceTable = () => {
    setReloadDataTable((prevState) => !prevState);
  };

  return (
    <div className="home">
      <Sidebar handelRefreshFromSidebar={handleReloadDeviceTable} />
      <div className="homeContainer">
        <Navbar />
        <div className="listContainer">
          <div className="listTitle">Devices</div>
          <Datatable key={reloadDataTable} />
        </div>
        {props.logViewer}
      </div>
    </div>
  );
}
export default Home;
