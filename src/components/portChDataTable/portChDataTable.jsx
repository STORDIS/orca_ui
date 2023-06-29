import "./PortChDataTable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { userRows, userColumns, portChannelColumns} from "../../datatablesourse";
import { useEffect, useState } from "react"
import axios from 'axios'



const PortChDataTable = (props) => {
    const {rows, columns, selectedItemId=''} = props;
    console.log( rows,columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        const apiPUrl = `http://localhost:8000/api/interfaces?mgt_ip=${selectedItemId}`; 
        axios .get (apiPUrl)
        .then(res => setDataTable(res.data))
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }, []); 

    return (
        <div className="portchdatatable">
            <DataGrid
                rows={dataTable}
                columns={portChannelColumns}
                pageSize= {5}
                rowsPerPageOptions= {[5]}
                checkboxSelection
        
            />
        </div>
    )
}

export default PortChDataTable