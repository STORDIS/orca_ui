import React, { useEffect, useRef, useMemo, useState } from "react";
import { useLog } from "../../LogContext";
import "./logpane.scss";
import Time from "react-time-format";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";

function LogViewer() {
    const { log, clearLog } = useLog();
    const [logEntries, setLogEntries] = useState([]);

    useEffect(() => {
        if (Object.keys(log).length !== 0) {
            setLogEntries((prevLogEntries) => [log, ...prevLogEntries]);
        }
    }, [log]);

    const handelClearLog = () => {
        clearLog();
        setLogEntries([]);
    };

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        {
            field: "index",
            headerName: "#",
            valueGetter: (params) => params.node.rowIndex + 1,
            width: 50,
            resizable: true,
        },
        { field: "timestamp", headerName: "Time", width: 150, resizable: true },
        { field: "result", headerName: "Task", width: 400, resizable: true },
        {
            field: "status",
            headerName: "Status",
            width: 400,
            resizable: true,
            cellRenderer: (params) => {
                if (params.value === "success") {
                    return (
                        <div className="icon">
                            <span class="material-symbols-outlined">
                                check_circle_outline
                            </span>
                        </div>
                    );
                } else {
                    return (
                        <div className="icon">
                            <span class="material-symbols-outlined">
                                cancel
                            </span>{" "}
                            &nbsp; {params.value}
                        </div>
                    );
                }
            },
            cellStyle: (params) => {
                if (params.value === "success") {
                    return { color: "green", display: "flex" };
                } else {
                    return { color: "red", display: "flex" };
                }
            },
        },
    ]);

    const gridRef = useRef();

    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    return (
        <div style={{ width: "100%", height: "300px" }}>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    rowData={logEntries}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={5}
                    paginationPageSizeSelector={[5, 10, 15]}
                />
            </div>

            <button className="clearLogBtn" onClick={handelClearLog}>
                Clear Log{" "}
            </button>
        </div>
    );
}

export default LogViewer;
