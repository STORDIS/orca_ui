import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { deviceUserColumns} from "../../datatablesourse";
import { useEffect, useState } from "react"
import axios from 'axios'
import {getAllDevicesURL} from "../../backend_rest_urls.js"



const Datatable = (props) => {
    const {rows, columns, isTabbedPane=false,selectedItemId=''} = props;
    console.log( rows,columns,selectedItemId)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        axios(getAllDevicesURL())
        .then(res =>{console.log ("response", res.data) 
        if(isTabbedPane){
            let data= res.data.filter(item=>item.mgt_ip == selectedItemId)
            setDataTable(data)
        }else{
            setDataTable(res.data)
        }
        })
        // .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }, [isTabbedPane]); 

    return (
        <div className="datatable">
            <DataGrid
                rows={dataTable}
                columns={deviceUserColumns(isTabbedPane)}
                pageSize= {5}
                rowsPerPageOptions= {[5]}        
            />
        </div>
    )
}

export default Datatable