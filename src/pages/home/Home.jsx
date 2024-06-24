import React from "react";
import Datatable from "../../components/tabbedpane/Datatable";

import "./home.scss";

export const Home = () => {
    return (
        <div>
            <div className="listContainer">
                <div className="listTitle">Devices</div>
                <div className="resizable">
                    <Datatable />
                </div>
            </div>
        </div>
    );
};
export default Home;
