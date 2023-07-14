import Datatable from "../../components/tabbedpane/Datatable";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

import "./home.scss";


function Home() {
    return (
        <div className='home'>
            <Sidebar />
            <div className="homeContainer">
                <Navbar/>
                <div className="widgets">

                </div>
                <div className="listContainer">
                    <div className="listTitle">Devices</div>
                    <Datatable/>
                </div>
            </div>    
        </div>
    );
}

export default Home