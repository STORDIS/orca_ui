import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss"
import { bgpColumns, defaultColDef } from "./datatablesourse";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios'
import { getAllBGPOfDeviceURL } from "../../backend_rest_urls";



const BGPTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const { rows, columns, selectedDeviceIp = '' } = props;
    console.log(rows, columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    
    useEffect(() => {
        const apiMUrl = getAllBGPOfDeviceURL(selectedDeviceIp);
        axios.get(apiMUrl)
            .then((res) => {
                // get neighbor_prop property from json and convert to string
                res.data.forEach(element => {
                    element.neighbor_prop = JSON.stringify(element.neighbor_prop);
                })
                setDataTable(res.data);})
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }, []);

    const onColumnResized = useCallback((params) => {
    }, []);

    return (
        <div className="datatable">
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={bgpColumns}
                    defaultColDef={defaultColDef}
                    onColumnResized={onColumnResized}
                    checkboxSelection
                    enableCellTextSelection='true'
                ></AgGridReact>
            </div>
        </div>
    )
}

export default BGPTable