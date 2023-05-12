import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import List from "../../components/table/Table";
import Widget from "../../components/widget/Widget";

import "./home.scss";


function Home() {
    return (
        <div className='home'>
            <Sidebar />
            <div className="homeContainer">
                <Navbar/>
                <div className="widgets">
                    <Widget/>
                    <Widget/>
                    <Widget/>
                    <Widget/>

                </div>
                <div className="listContainer">
                    <div className="listTitle">devices</div>
                    <List/>
                </div>
            </div>    
        </div>
    );
}

export default Home