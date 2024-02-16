import React, { useState } from "react";
import Datatable from "../../components/tabbedpane/Datatable";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

import "./home.scss";

function Home(props) {
  const [reloadDataTable, setReloadDataTable] = useState(false);

  // Callback function to handle button click in NavBar
  const handleReloadButtonClick = () => {
    // Set the state to trigger a re-render of the Home component
    setReloadDataTable((prevState) => !prevState);
    console.log("here");
  };

  return (
    <div className="home">
      <Sidebar handelRefreshFromSidebar={handleReloadButtonClick} />
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
