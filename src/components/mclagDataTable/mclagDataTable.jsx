import "./McLagDataTable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { mclagColumns } from "../../datatablesourse";
import { useEffect, useState } from "react"
import axios from 'axios'
import { getAllMclagsOfDeviceURL } from "../../backend_rest_urls";



const McLagDataTable = (props) => {
    const { rows, columns, selectedItemId = '' } = props;
    console.log(rows, columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        const apiMUrl = getAllMclagsOfDeviceURL(selectedItemId);
        axios.get(apiMUrl)
            .then(res => setDataTable(res.data))
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="mclagdatatable">
            <DataGrid
                rows={dataTable}
                columns={mclagColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection

            />
        </div>
    )
}

export default McLagDataTable