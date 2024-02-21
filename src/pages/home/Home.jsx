import React, { useEffect } from "react";
import Datatable from "../../components/tabbedpane/Datatable";

import "./home.scss";

// import { useLog } from "../../LogContext";

function Home() {
  // const { setLog } = useLog();

  // useEffect(() => {
  //   setLog("test");
  // }, [setLog]);

  return (
    <div>
      <div className="listContainer">
        <div className="listTitle">Devices</div>
        <Datatable />
      </div>
    </div>
  );
}
export default Home;
