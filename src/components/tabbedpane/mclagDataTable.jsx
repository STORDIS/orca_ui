import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss"
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { mclagColumns, defaultColDef } from "./datatablesourse";
import { getAllMclagsOfDeviceURL } from "../../backend_rest_urls";
import interceptor from "../../interceptor";


const McLagDataTable = (props) => {
    const instance = interceptor();

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const { rows, columns, selectedDeviceIp = '' } = props;

    const [dataTable, setDataTable] = useState([]);
    
    useEffect(() => {
        const apiMUrl = getAllMclagsOfDeviceURL(selectedDeviceIp);
        instance.get(apiMUrl)
            .then(res => setDataTable(res.data))
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
                    columnDefs={mclagColumns}
                    defaultColDef={defaultColDef}
                    onColumnResized={onColumnResized}
                    checkboxSelection
                    enableCellTextSelection='true'
                ></AgGridReact>
            </div>
        </div>
    )
}

export default McLagDataTable