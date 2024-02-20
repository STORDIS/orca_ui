import React, { useEffect } from "react";
import Datatable from "../../components/tabbedpane/Datatable";

import "./home.scss";

function Home(props) {
  return (
    <div>
      <div className="listContainer">
        <div className="listTitle">Devices</div>
        <Datatable />
      </div>
      <div className="listContainer">{props.logViewer}</div>
    </div>
  );
}
export default Home;
