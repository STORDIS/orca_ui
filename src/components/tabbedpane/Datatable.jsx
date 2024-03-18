import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss"
import { deviceUserColumns, defaultColDef } from "./datatablesourse";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getAllDevicesURL } from "../../backend_rest_urls.js";

import interceptor from "../../interceptor";

const Datatable = (props) => {
  const instance = interceptor();

  const gridRef = useRef();
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const { rows, columns, isTabbedPane = false, selectedDeviceIp = '' } = props;
  console.log(rows, columns, selectedDeviceIp)

  const [dataTable, setDataTable] = useState([]);
  console.log(dataTable)
  
  useEffect(() => {
    instance(getAllDevicesURL())
      .then(res => {
        console.log("response", res.data)
        if (isTabbedPane) {
          let data = res.data.filter(item => item.mgt_ip === selectedDeviceIp)
          setDataTable(data)
        } else {
          setDataTable(res.data)
        }
      })
      // .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }, [isTabbedPane]);

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
          enableCellTextSelection='true'
        ></AgGridReact>
      </div>
    </div>
  )
}

export default Datatable