import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { portChannelColumns } from "./datatablesourse";
import axios from 'axios'
import { getAllPortChnlsOfDeviceURL } from '../../backend_rest_urls'



const PortChDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const { rows, columns, selectedDeviceIp = '' } = props;
    console.log(rows, columns)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        axios.get(apiPUrl)
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
                    columnDefs={portChannelColumns}
                    defaultColDef={defaultColDef}
                    onColumnResized={onColumnResized}
                    checkboxSelection
                ></AgGridReact>
            </div>
        </div>
    )
}

export default PortChDataTable