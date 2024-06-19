import React from "react";
import Datatable from "../../components/tabbedpane/Datatable";

import "./home.scss";

export const Home = () => {
    return (
        <div className="listContainer zoom ">
            <div className="listTitle">Devices</div>
            <div className="resizable">
                <Datatable />
            </div>
        </div>
    );
};
export default Home;
