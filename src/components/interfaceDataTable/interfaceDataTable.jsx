import "./InterfaceDataTable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { userRows, userColumns, interfaceColumns } from "../../datatablesourse";
import { useEffect, useState } from "react"
import axios from 'axios'



const InterfaceDataTable = (props) => {
    const { rows, columns, selectedItemId = '' } = props;
    console.log(rows, columns);

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        const apiUrl = `http://localhost:8000/api/interfaces?mgt_ip=${selectedItemId}`;
        axios.get(apiUrl)
            .then(res => setDataTable(res.data))
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="interfacedatatable">
            <DataGrid
                rows={dataTable}
                columns={interfaceColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection

            />
        </div>
    )
}

export default InterfaceDataTable