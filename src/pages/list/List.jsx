import Datatable from "../../components/tabbedpane/Datatable"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./list.scss"

const List1 = () => {
    return(
        <div className='list1'>
            <Sidebar/>
            <div className="listContainer1">
                <Navbar/>
                <Datatable/>
            </div>
        </div>
    )
}

export default List1