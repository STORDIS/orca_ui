import "./bgpTable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { bgpColumns } from "../../datatablesourse";
import { useEffect, useState } from "react"
import axios from 'axios'
import { getAllBGPOfDeviceURL } from "../../backend_rest_urls";



const BGPTable = (props) => {
    const { rows, columns, selectedItemId = '' } = props;
    console.log(rows, columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        const apiMUrl = getAllBGPOfDeviceURL(selectedItemId);
        axios.get(apiMUrl)
            .then(res => setDataTable(res.data))
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="bgptable">
            <DataGrid
                rows={dataTable}
                columns={bgpColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection

            />
        </div>
    )
}

export default BGPTable