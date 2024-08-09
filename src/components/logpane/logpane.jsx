import React, { useEffect, useMemo, useState } from "react";
import "./logpane.scss";
import Time from "react-time-format";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import interceptor from "../../utils/interceptor";
import { logPanelURL, logPanelDeleteURL } from "../../utils/backend_rest_urls";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { getIsStaff } from "../tabbedpane/datatablesourse";
import useStoreLogs from "../../utils/store";

export const LogViewer = () => {
    const [logEntries, setLogEntries] = useState([]);

    const instance = interceptor();

    const updateLog = useStoreLogs((state) => state.updateLog);
    const resetUpdateLog = useStoreLogs((state) => state.resetUpdateLog);

    useEffect(() => {
        if (updateLog) {
            getLogs();
        }
    }, [updateLog]);

    useEffect(() => {
        getLogs();
    }, []);

    const getLogs = () => {
        instance
            .get(logPanelURL())
            .then((response) => {
                setLogEntries(response.data);
                resetUpdateLog();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handelClearLog = () => {
        instance
            .delete(logPanelDeleteURL())
            .then((response) => {
                resetUpdateLog();
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                getLogs();
                resetUpdateLog();
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
            width: 170,
            resizable: true,
            filter: true,
            sortable: true,
            cellRenderer: (params) => {
                return (
                    <Time value={params?.value} format="hh:mm:ss DD-MM-YYYY" />
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
            width: 700,
            resizable: true,
            filter: true,
            sortable: true,
            cellRenderer: (params) => {
                return (
                    <span>
                        {params.data.http_method} :{" "}
                        {JSON.stringify(params.value)}
                    </span>
                );
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
        <div className="logPanel">
            <div className="stickyButton">
                <button
                    className="clearLogBtn btnStyle"
                    onClick={handelClearLog}
                    disabled={!getIsStaff()}
                >
                    Clear Log
                </button>
            </div>
            <div style={gridStyle} className="ag-theme-alpine table">
                <AgGridReact
                    rowData={logEntries}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={50}
                    paginationPageSizeSelector={[50, 100, 150, 200]}
                    domLayout={"autoHeight"}
                />
            </div>
        </div>
    );
};

export default LogViewer;
