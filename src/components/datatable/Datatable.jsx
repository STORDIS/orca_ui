import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { deviceUserColumns} from "../../datatablesourse";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios'
import {getAllDevicesURL} from "../../backend_rest_urls.js";
import { Link } from "react-router-dom";

const Datatable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const {rows, columns, isTabbedPane=false,selectedItemId=''} = props;
    console.log( rows,columns,selectedItemId)

    const [dataTable, setDataTable] = useState([]);
    console.log(dataTable)
    useEffect(() => {
        axios(getAllDevicesURL())
        .then(res =>{console.log ("response", res.data) 
        if(isTabbedPane){
            let data= res.data.filter(item=>item.mgt_ip == selectedItemId)
            setDataTable(data)
        }else{
            setDataTable(res.data)
        }
        })
        // .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }, [isTabbedPane]); 

    const defaultColDef =  {
        tooltipValueGetter:(params)=> {return params.value},
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
              columnDefs={deviceUserColumns(isTabbedPane)}
              defaultColDef={defaultColDef}
              onColumnResized={onColumnResized}
            ></AgGridReact>
          </div>
        </div>
    )
}

export default Datatable