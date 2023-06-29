import "./McLagDataTable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { mclagColumns } from "../../datatablesourse";
import { useEffect, useState } from "react"
import axios from 'axios'



const McLagDataTable = (props) => {
    const { rows, columns, selectedItemId = '' } = props;
    console.log(rows, columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        const apiMUrl = `http://localhost:8000/api/mclags?mgt_ip=${selectedItemId}`;
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