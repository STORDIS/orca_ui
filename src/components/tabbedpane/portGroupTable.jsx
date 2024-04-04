import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss";
import { portGroupColumns, defaultColDef } from "./datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { getPortGroupsURL } from "../../backend_rest_urls";
import "../../pages/home/home.scss";
import interceptor from "../../interceptor";

const PortGroupTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
    const { selectedDeviceIp = "" } = props;
    const [changes, setChanges] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [isConfigInProgress, setIsConfigInProgress] = useState(false);
    const [configStatus, setConfigStatus] = useState("");

    const instance = interceptor();

    useEffect(() => {
        const apiMUrl = getPortGroupsURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
            })
            .catch((err) => console.log(err));
    }, [selectedDeviceIp]);

    useEffect(() => {
        if (props.refresh) {
            props.setRefresh(!props.refresh);
            setDataTable(JSON.parse(JSON.stringify(originalData)));
            setChanges([]);
        }
    }, [props.refresh]);

    const onColumnResized = useCallback((params) => {}, []);

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
                        (val) => val.port_group_id === params.data.port_group_id
                    );
                    if (isNameExsits.length > 0) {
                        let existedIndex = prev.findIndex(
                            (val) =>
                                val.port_group_id === params.data.port_group_id
                        );
                        prev[existedIndex][params.colDef.field] =
                            params.newValue;
                        latestChanges = [...prev];
                    } else {
                        latestChanges = [
                            ...prev,
                            {
                                port_group_id: params.data.port_group_id,
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

    const createReqJson = useCallback(() => {
        return changes.map((change) => ({
            mgt_ip: selectedDeviceIp,
            port_group_id: change.port_group_id,
            ...change,
        }));
    }, [selectedDeviceIp, changes]);

    const sendUpdates = useCallback(() => {
        if (changes.length === 0) {
            return;
        }
        setIsConfigInProgress(true);
        setConfigStatus("Config In Progress....");

        const req_json = createReqJson();
        console.log(JSON.stringify(req_json));
        const apiUrl = getPortGroupsURL(selectedDeviceIp);
        instance
            .put(apiUrl, req_json)
            .then((res) => {
                setConfigStatus("Config Successful");
            })
            .catch((err) => {
                setConfigStatus("Config Failed");
            })
            .finally(() => {
                setIsConfigInProgress(false);
                setChanges([]);
            });
    }, [createReqJson, selectedDeviceIp, changes]);

    return (
        <div className="datatable">
            <button
                type="button"
                style={{ marginBottom: "15px" }}
                onClick={sendUpdates}
                disabled={isConfigInProgress || changes.length === 0}
                className="btnStyle"
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
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={portGroupColumns}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellValueChanged}
                    onColumnResized={onColumnResized}
                    checkboxSelection
                    enableCellTextSelection="true"
                    stopEditingWhenCellsLoseFocus={true}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default PortGroupTable;
