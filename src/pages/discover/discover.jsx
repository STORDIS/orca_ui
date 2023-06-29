import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";


function Discover() {
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
