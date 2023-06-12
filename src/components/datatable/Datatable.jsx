import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { userRows, userColumns, deviceUserColumns} from "../../datatablesourse";
import { useEffect, useState } from "react"
import axios from 'axios'
import {ALL_DEVICE_URL} from "../../constants";



const Datatable = (props) => {
    const {rows, columns} = props;
    console.log( rows,columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        axios(ALL_DEVICE_URL)
        //axios('http://localhost:8000/api/interfaces')
        .then(res => setDataTable(res.data))
        // .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }, []); 

    return (
        <div className="datatable">
            <DataGrid
                rows={dataTable}
                columns={deviceUserColumns}
                pageSize= {5}
                rowsPerPageOptions= {[5]}
                checkboxSelection
        
            />
        </div>
    )
}

export default Datatable