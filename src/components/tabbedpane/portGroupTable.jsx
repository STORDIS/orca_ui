import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss"
import { portGroupColumns } from "./datatablesourse";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios'
import { getPortGroupsURL } from "../../backend_rest_urls";



const PortGroupTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const { rows, columns, selectedDeviceIp = '' } = props;
    console.log(rows, columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        const apiMUrl = getPortGroupsURL(selectedDeviceIp);
        axios.get(apiMUrl)
            .then(res => setDataTable(res.data))
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }, []);

    const defaultColDef = {
        tooltipValueGetter: (params) => { return params.value },
        resizable: true,
    }

    const onColumnResized = useCallback((params) => {
    }, []);

    return (
        <div className="datatable">
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={portGroupColumns}
                    defaultColDef={defaultColDef}
                    onColumnResized={onColumnResized}
                    checkboxSelection
                    enableCellTextSelection='true'
                ></AgGridReact>
            </div>
        </div>
    )
}

export default PortGroupTable