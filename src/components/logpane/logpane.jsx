import React, { useEffect, useMemo, useState, useRef } from "react";
import "./logpane.scss";
import Time from "react-time-format";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import interceptor from "../../utils/interceptor";
import { logPanelURL, logPanelDeleteURL } from "../../utils/backend_rest_urls";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { getIsStaff } from "../../utils/common";
import useStoreLogs from "../../utils/store";
import { FaRegPlayCircle } from "react-icons/fa";
import GenericLogModal from "../../components/modal/genericLogModal";
import SetupLogModal from "../../components/modal/setupLogModal";
import { FaRotateLeft } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa";

export const LogViewer = () => {
    const logPannelDivRef = useRef(null);

    const [logEntries, setLogEntries] = useState([]);

    const instance = interceptor();

    const updateLog = useStoreLogs((state) => state.updateLog);
    const resetUpdateLog = useStoreLogs((state) => state.resetUpdateLog);

    const test = [
        {
            status: "SUCCESS",
            timestamp: "2024-11-14 09:16:27",
            status_code: 200,
            http_method: "PUT",
            processing_time: 714.823822,
            response: {
                "10.10.229.112": {
                    output: "",
                    error: "timed out",
                },
            },
            request_json: {
                device_ips: ["10.10.229.112"],
                image_url:
                    "http://10.10.128.249/sonic/release/4.2.2/sonic-vs.bin",
                discover_also: false,
                username: null,
                password: null,
            },
            http_path: "/install_image",
            task_id: "19b01f67-7e2e-4cb2-870b-591870c48c08",
        },
        {
            status: "SUCCESS",
            timestamp: "2024-11-14 09:16:27",
            status_code: 200,
            http_method: "PUT",
            processing_time: 710.77447,
            response: {
                onie_devices: {
                    "10.10.229.123/28": [
                        {
                            "ONIE Version": "master-201811170418",
                            "CRC-32": "0x75709CF2",
                            mgt_ip: "10.10.229.123",
                        },
                    ],
                },
                sonic_devices: {
                    "10.10.229.123/28": [
                        {
                            img_name: "SONiC-OS-4.4.0-Enterprise_Base",
                            mgt_intf: "Management0",
                            mgt_ip: "10.10.229.114",
                            hwsku: "DellEMC-S5248f-P-25G-DPB",
                            mac: "0c:70:d3:24:00:0a",
                            platform: "x86_64-kvm_x86_64-r0",
                            type: "LeafRouter",
                        },
                        {
                            img_name: "SONiC-OS-4.1.4-Enterprise_Base",
                            mgt_intf: "Management0",
                            mgt_ip: "10.10.229.118",
                            hwsku: "DellEMC-S5248f-P-25G-DPB",
                            mac: "0c:33:fb:e0:00:0a",
                            platform: "x86_64-kvm_x86_64-r0",
                            type: "LeafRouter",
                        },
                        {
                            img_name: "SONiC-OS-4.4.0-Enterprise_Base",
                            mgt_intf: "Management0",
                            mgt_ip: "10.10.229.120",
                            hwsku: "DellEMC-S5248f-P-25G-DPB",
                            mac: "0c:29:e5:ca:00:0a",
                            platform: "x86_64-kvm_x86_64-r0",
                            type: "LeafRouter",
                        },
                        {
                            img_name: "SONiC-OS-4.2.2-Enterprise_Base",
                            mgt_intf: "Management0",
                            mgt_ip: "10.10.229.124",
                            hwsku: "DellEMC-S5248f-P-25G-DPB",
                            mac: "0c:17:33:aa:00:0a",
                            platform: "x86_64-kvm_x86_64-r0",
                            type: "LeafRouter",
                            system_status: "System is ready",
                            image_list: [
                                "SONiC-OS-4.2.2-Enterprise_Base",
                                "SONiC-OS-4.4.0-Enterprise_Base",
                            ],
                            element_id_property:
                                "4:94045296-2953-4cfc-b734-c86a65193436:563",
                        },
                    ],
                },
            },
        },
    ];

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
            width: 500,
            resizable: true,
            filter: true,
            sortable: true,
            cellRenderer: (params) => {
                return (
                    <span>
                        {params.data.http_method} :
                        {JSON.stringify(params.value)}
                    </span>
                );
            },
            tooltipValueGetter: (params) => {
                return JSON.stringify(params?.value);
                // return "tool";
            },
        },
        {
            field: "status",
            headerName: "State",
            width: 400,
            resizable: true,
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
                if (params.value.toUpperCase() === "SUCCESS") {
                    return (
                        <div
                            className="icon"
                            id={params?.data?.status_code}
                            state="SUCCESS"
                        >
                            <FaRegCheckCircle style={{ fontSize: "24px" }} />
                        </div>
                    );
                } else if (params.value.toUpperCase() === "STARTED") {
                    return (
                        <div
                            className="icon"
                            id={params?.data?.status_code}
                            state="STARTED"
                        >
                            <FaRegPlayCircle style={{ fontSize: "24px" }} />
                            &nbsp; {params.data.status}
                        </div>
                    );
                } else if (params.value.toUpperCase() === "PENDING") {
                    return (
                        <div
                            className="icon"
                            id={params?.data?.status_code}
                            state="PENDING"
                        >
                            <FaHourglassHalf style={{ fontSize: "24px" }} />
                            &nbsp; {params.data.status}
                        </div>
                    );
                } else if (params.value.toUpperCase() === "REVOKED") {
                    return (
                        <div
                            className="icon"
                            id={params?.data?.status_code}
                            state="REVOKED"
                        >
                            <FaRotateLeft style={{ fontSize: "24px" }} />
                            &nbsp; {JSON.stringify(params?.data?.response)}
                            &nbsp;
                        </div>
                    );
                } else {
                    return (
                        <div
                            className="icon"
                            id={params?.data?.status_code}
                            state="FAILED"
                        >
                            <FaRegCircleXmark style={{ fontSize: "24px" }} />
                            &nbsp; {JSON.stringify(params?.data?.response)}
                            &nbsp;
                        </div>
                    );
                }
            },
            cellStyle: (params) => {
                if (params.value.toUpperCase() === "SUCCESS") {
                    return { color: "#198754", display: "flex" };
                } else if (params.value.toUpperCase() === "STARTED") {
                    return { color: "#FFC107", display: "flex" };
                } else if (params.value.toUpperCase() === "PENDING") {
                    return { color: "#6C757D", display: "flex" };
                } else if (params.value.toUpperCase() === "REVOKED") {
                    return { color: "#198754", display: "flex" };
                } else {
                    return { color: "#DC3545", display: "flex" };
                }
            },
            tooltipValueGetter: (params) => {
                if (params?.data?.response) {
                    return JSON.stringify(params?.data?.response);
                } else {
                    return params?.data?.status;
                }
            },
        },
    ]);

    const [height, setHeight] = useState(400);

    useEffect(() => {
        if (updateLog) {
            getLogs();
        }
    }, [updateLog]);

    useEffect(() => {
        getLogs();
    }, []);

    const getLogs = () => {
        // console.log("get");
        setLogEntries([]);
        instance
            .get(logPanelURL())
            .then((response) => {
                setLogEntries(response.data);
                resetUpdateLog();
            })
            .catch((error) => {
                console.error("Error:", error);
                setLogEntries([]);
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

    const handleResize = () => {
        if (logPannelDivRef.current.offsetHeight > 400) {
            setHeight(logPannelDivRef.current.offsetHeight);
        }
    };

    const gridStyle = useMemo(
        () => ({ height: height - 100 + "px", width: "100%" }),
        [height]
    );

    const [showLogDetails, setShowLogDetails] = useState("null");
    const [logDetails, setLogDetails] = useState({});

    const openLogDetails = (params) => {
        getLogs();
        // console.log(params.data);

        setTimeout(() => {
            switch (params.data.http_path) {
                case "/install_image":
                    setShowLogDetails("setupDialog");
                    break;
                case "/switch_image":
                    setShowLogDetails("setupDialog");
                    break;

                default:
                    setShowLogDetails("genericDialog");
                    break;
            }

            setLogDetails(test[1]);
            // setLogDetails(params.data);
        }, 500);
    };

    return (
        <div
            className="logPanel resizable"
            id="logPanel"
            ref={logPannelDivRef}
            onMouseMove={handleResize}
        >
            <div
                className="mb-15"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <button
                    id="clearLogBtn"
                    className="clearLogBtn btnStyle "
                    onClick={handelClearLog}
                    disabled={!getIsStaff()}
                >
                    Clear
                </button>

                <button
                    id="refreshLogBtn"
                    className="clearLogBtn btnStyle"
                    onClick={getLogs}
                    disabled={!getIsStaff()}
                >
                    Refresh
                </button>
            </div>
            <div style={gridStyle} className="ag-theme-alpine ">
                <AgGridReact
                    rowData={logEntries}
                    columnDefs={colDefs}
                    onRowClicked={(params) => {
                        openLogDetails(params);
                    }}
                    pagination={true}
                    paginationPageSize={50}
                    paginationPageSizeSelector={[50, 100, 150, 200]}
                />
            </div>

            {showLogDetails === "setupDialog" && (
                <SetupLogModal
                    logData={logDetails}
                    onClose={() => setShowLogDetails(false)}
                    onSubmit={() => setShowLogDetails(false)}
                    title="Log Details"
                    id="setupLogDetails"
                />
            )}
            {showLogDetails === "genericDialog" && (
                <GenericLogModal
                    logData={logDetails}
                    onClose={() => setShowLogDetails(false)}
                    onSubmit={() => setShowLogDetails(false)}
                    title="Log Details"
                    id="genericLogDetails"
                />
            )}
        </div>
    );
};

export default LogViewer;
