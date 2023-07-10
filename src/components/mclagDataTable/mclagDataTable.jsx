import { useEffect, useState, useRef, useCallback,useMemo } from "react";
import "./McLagDataTable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { mclagColumns } from "../../datatablesourse";
import axios from 'axios'
import { getAllMclagsOfDeviceURL } from "../../backend_rest_urls";



const McLagDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
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

    const defaultColDef = {
        tooltipValueGetter:(params)=> {return params.value},
          resizable: true,
      }

      const onColumnResized = useCallback((params) => {
      }, []);


    return (
        <div className="mclagdatatable">
            <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={dataTable}
              columnDefs={mclagColumns}
              defaultColDef={defaultColDef}
              onColumnResized={onColumnResized}
              checkboxSelection
            ></AgGridReact>
            </div>
        </div>
    )
}

export default McLagDataTable