//import Datatable from "../../components/datatable/Datatable"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import { useEffect, useState } from "react"
import axios from 'axios'
import "./interface.scss"
import InterfaceTable from "./InterfaceTable"
//const API = "https://jsonplaceholder.typicode.com/users"


const Interface = () => {

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        axios('https://jsonplaceholder.typicode.com/users')
        //axios('http://localhost:8000/api/interfaces')
        .then(res => setDataTable(res.data))
        .catch(err => console.log(err))
    }, []);
 
    const column =[
        {heading: 'Name' , value: 'name'},
        {heading: 'Email' , value: 'email'},
        {heading: 'Phone' , value: 'phone'},
    ]


    

    

    return(
        <div className='list1'>
            <Sidebar/>
            <div className="listContainer1">
                <Navbar/>
                <InterfaceTable data={dataTable} column={column}/>
            </div>
        </div>
    )

    }
export default Interface