import Datatable from "../../components/tabbedpane/Datatable";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import LogViewer from "../../components/logpane/logpane";

import "./home.scss";


function Home() {

    return (
        <div className='home'>
            <Sidebar />
            <div className="homeContainer">
                    <Navbar />
                <div className="listContainer">
                    <div className="listTitle">Devices</div>
                    <Datatable />
                </div>
                <div className="listContainer">
                    <div className="listTitle">Logs</div>
                    <LogViewer />
                </div>
            </div>
        </div>
    );
}
export default Home