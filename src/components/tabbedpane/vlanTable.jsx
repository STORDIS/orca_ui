import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss"
import { vlanColumns, defaultColDef } from "./datatablesourse";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios'
import { getVlansURL } from "../../backend_rest_urls";

const VlanTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const { selectedDeviceIp = '' } = props;
    const [dataTable, setDataTable] = useState([]);
    useEffect(() => {
        const apiMUrl = getVlansURL(selectedDeviceIp);
        axios.get(apiMUrl)
            .then((res) => {
                //iterate the json array res.data and convert the value of key "members" in each element to string
                res.data.forEach(element => {
                    element.members = JSON.stringify(element.members);
                });
                setDataTable(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="datatable">
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={vlanColumns}
                    defaultColDef={defaultColDef}
                ></AgGridReact>
            </div>
        </div>
    )
}

export default VlanTable