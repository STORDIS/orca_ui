import React, { useEffect, useMemo, useState } from "react";
import "./logpane.scss";
import Time from "react-time-format";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import interceptor from "../../utils/interceptor";
import { logPanelURL, logPanelDeleteURL } from "../../utils/backend_rest_urls";
import { useLog } from "../../utils/logpannelContext";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { getIsStaff } from "../tabbedpane/datatablesourse";

export const LogViewer = () => {
    const [logEntries, setLogEntries] = useState([]);

    const instance = interceptor();

    const { log, setLog } = useLog();

    useEffect(() => {
        getLogs();
    }, [log]);

    const getLogs = () => {
        instance
            .get(logPanelURL())
            .then((response) => {
                setLogEntries(response.data);
                setLog(false);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handelClearLog = () => {
        instance
            .delete(logPanelDeleteURL())
            .then((response) => {
                setLog(false);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                getLogs();
                setLog(false);
            });
    };

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState([
        {
            field: "index",
            headerName: "#",
            valueGetter: (params) => params.node.rowIndex + 1,
            width: 50,
            resizable: true,
            filter: true,
            sortable: true,
        },
        {
            field: "timestamp",
            headerName: "Time",
            width: 150,
            resizable: true,
            filter: true,
            sortable: true,
            cellRenderer: (params) => {
                return (
                    <Time value={params.value} format="hh:mm:ss DD-MM-YYYY" />
                );
            },
            tooltipValueGetter: (params) => {
                return params.value;
            },
        },
        {
            field: "processing_time",
            headerName: "Process Time",
            width: 100,
            resizable: true,
            filter: true,
            sortable: true,
            cellRenderer: (params) => {
                let num = params.value;
                num = parseFloat(num);
                num = num.toFixed(2);
                return <span>{num} sec</span>;
            },
            tooltipValueGetter: (params) => {
                return params.value;
            },
        },
        {
            field: "request_json",
            headerName: "Task",
            width: 400,
            resizable: true,
            filter: true,
            sortable: true,
            cellRenderer: (params) => {
                return <span>{JSON.stringify(params.value)}</span>;
            },
            tooltipValueGetter: (params) => {
                return JSON.stringify(params.value);
            },
        },
        {
            field: "status",
            headerName: "Status",
            width: 400,
            resizable: true,
            sortable: true,
            cellRenderer: (params) => {
                if (params.value === "success") {
                    return (
                        <div className="icon">
                            <FaRegCheckCircle style={{ fontSize: "24px" }} />
                        </div>
                    );
                } else {
                    return (
                        <div className="icon">
                            <FaRegCircleXmark style={{ fontSize: "24px" }} />
                            &nbsp; {params.data.response} &nbsp;
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
            tooltipValueGetter: (params) => { 
                return params.data.response;
            },
        },
    ]);

    const gridStyle = useMemo(() => ({ height: "440px", width: "100%" }), []);

    return (
        <div style={{ width: "100%", height: "470px" }}>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    rowData={logEntries}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={50}
                    paginationPageSizeSelector={[50, 100, 150, 200]}
                />

                <button
                    className="clearLogBtn btnStyle"
                    onClick={handelClearLog}
                    disabled={!getIsStaff()}
                >
                    Clear Log
                </button>
            </div>
        </div>
    );
};

export default LogViewer;
