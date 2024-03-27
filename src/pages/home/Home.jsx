import React from "react";
import Datatable from "../../components/tabbedpane/Datatable";

import "./home.scss";

export const Home = () => {

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
