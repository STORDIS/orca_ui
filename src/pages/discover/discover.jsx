import { DISCOVERY_URL } from "../../constants";
import { useEffect } from "react"
import axios from 'axios'
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";


function Discover() {
    // useEffect(() => {
    //     axios(DISCOVERY_URL)
    //     .catch(err => console.log(err))
    // }, []);

    return (
        <div className='home'>
            <Sidebar />
            <div className="homeContainer">
                <Navbar/>
                <div className="widgets">

                </div>
                <div className="listContainer">
                    <div className="listTitle">Discovery in progress</div>
                </div>
            </div>    
        </div>
    );
}

export default Discover
