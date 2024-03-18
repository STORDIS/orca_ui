import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss";
import { interfaceColumns, defaultColDef } from "./datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllInterfacesOfDeviceURL } from "../../backend_rest_urls";

import { useLog } from "../../LogContext";
import interceptor from "../../interceptor";

const InterfaceDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const { selectedDeviceIp = "" } = props;
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isConfigInProgress, setIsConfigInProgress] = useState(false);
    const [configStatus, setConfigStatus] = useState("");
    const [interfaceNames, setInterfaceNames] = useState([]);

    const { setLog } = useLog();
    const instance = interceptor();

    const setInterfaceData = () => {
        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        instance
            .get(apiUrl)
            .then((res) => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
                const names = res.data.map(item => item.name);
                setInterfaceNames(names);
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        if (selectedDeviceIp) {
            setInterfaceData();
        }
    }, [selectedDeviceIp]);

    useEffect(() => {
        if (props.refresh) {
            props.setRefresh(!props.refresh);
            setDataTable(JSON.parse(JSON.stringify(originalData)));
            setChanges([]);
        }
    }, [props.refresh]);

    const resetConfigStatus = () => {
        setConfigStatus("");
        setChanges([]);
    };

    const handleCellValueChanged = useCallback(
        (params) => {
            if (params.newValue !== params.oldValue) {
                setChanges((prev) => {
                    if (!Array.isArray(prev)) {
                        console.error("Expected array but got:", prev);
                        return [];
                    }
                    let latestChanges;
                    let isNameExsits = prev.filter(
                        (val) => val.name === params.data.name
                    );
                    if (isNameExsits.length > 0) {
                        let existedIndex = prev.findIndex(
                            (val) => val.name === params.data.name
                        );
                        prev[existedIndex][params.colDef.field] =
                            params.newValue;
                        latestChanges = [...prev];
                    } else {
                        latestChanges = [
                            ...prev,
                            {
                                name: params.data.name,
                                [params.colDef.field]: params.newValue,
                            },
                        ];
                    }
                    return latestChanges;
                });
            }
        },
        [dataTable]
    );

    useEffect(() => {
        setDataTable(JSON.parse(JSON.stringify(originalData)));
        setChanges([]);
    }, [selectedDeviceIp]);

    const createJsonOutput = useCallback(() => {
        return changes.map((change) => ({
            mgt_ip: selectedDeviceIp,
            name: change.name,
            ...change,
        }));
    }, [selectedDeviceIp, changes]);

    useEffect(() => {
        if (changes.length) {
            const output = createJsonOutput();
            console.log(JSON.stringify(output));
        }
    }, [changes, createJsonOutput]);

    const sendUpdates = useCallback(() => {
        if (changes.length === 0) {
            return;
        }
        setIsConfigInProgress(true);
        setConfigStatus("Config In Progress....");
        const output = createJsonOutput();
        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiUrl, output)
            .then((res) => {
                let startIndex = res.data.result[0].indexOf("{");
                let endIndex = res.data.result[0].lastIndexOf("}");
                let trimmedResponse = res.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );
                setLog({
                    status: "success",
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });

                setConfigStatus("Config Successful");
                setTimeout(resetConfigStatus, 5000);
            })
            .catch((err) => {
                console.log("check", err);

                let startIndex = err.response.data.result[0].indexOf("{");
                let endIndex = err.response.data.result[0].lastIndexOf("}");
                let trimmedResponse = err.response.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );
                const match = err.response.data.result[0].match(/Reason:(.*)/);
                const reasonText = match[1].trim();
                setLog({
                    status: reasonText,
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });

                setConfigStatus("Config Failed");
                setInterfaceData();

                setTimeout(resetConfigStatus, 5000);
            })
            .finally(() => {
                setIsConfigInProgress(false);
                setChanges([]);
            });
    }, [createJsonOutput, selectedDeviceIp, changes]);

    return (
        <div className="datatable">
            <button
                onClick={sendUpdates}
                disabled={isConfigInProgress || changes.length === 0}
                className={
                    isConfigInProgress || changes.length === 0
                        ? "button-disabled"
                        : ""
                }
            >
                Apply Config
            </button>
            <span
                className={`config-status ${
                    configStatus === "Config Successful"
                        ? "config-successful"
                        : configStatus === "Config Failed"
                        ? "config-failed"
                        : "config-in-progress"
                }`}
            >
                {configStatus}
            </span>
            <p>&nbsp;</p>

            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={interfaceColumns}
                    defaultColDef={defaultColDef}
                    stopEditingWhenCellsLoseFocus={true}
                    onCellValueChanged={handleCellValueChanged}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default InterfaceDataTable;
