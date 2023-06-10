import "./McLagDataTable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { userRows, userColumns, mclagColumns} from "../../datatablesourse";
import { useEffect, useState } from "react"
import axios from 'axios'



const McLagDataTable = (props) => {
    const {rows, columns} = props;
    console.log( rows,columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        axios('http://localhost:8000/portchannel.json')
        //axios('http://localhost:8000/api/interfaces')
        .then(res => setDataTable(res.data))
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }, []); 

    return (
        <div className="mclagdatatable">
            <DataGrid
                rows={dataTable}
                columns={mclagColumns}
                pageSize= {5}
                rowsPerPageOptions= {[5]}
                checkboxSelection
        
            />
        </div>
    )
}

export default McLagDataTable