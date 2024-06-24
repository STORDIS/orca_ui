import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { portGroupColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { getPortGroupsURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const PortGroupTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
    const [changes, setChanges] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [configStatus, setConfigStatus] = useState("");

    const instance = interceptor();
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const selectedDeviceIp = props.selectedDeviceIp;

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            setChanges([]);
            setDataTable([]);
            setOriginalData([]);

            const apiMUrl = getPortGroupsURL(selectedDeviceIp);
            instance
                .get(apiMUrl)
                .then((res) => {
                    setDataTable(res.data);
                    setOriginalData(JSON.parse(JSON.stringify(res.data)));
                })
                .catch((err) => console.log(err));
        }
        props.reset(false);
    }, [props.refresh]);

    useEffect(() => {
        setChanges([]);
        setDataTable([]);
        setOriginalData([]);

        const apiMUrl = getPortGroupsURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
            })
            .catch((err) => console.log(err));
    }, [selectedDeviceIp]);

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
        setDisableConfig(true);
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
                setChanges([]);
                setLog(true);
                setDisableConfig(false);
            });
    }, [createReqJson, selectedDeviceIp, changes]);

    return (
        <div className="datatable">
            <div className="stickyButton">
                <button
                    type="button"
                    style={{ marginBottom: "15px" }}
                    onClick={sendUpdates}
                    disabled={disableConfig}
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
            </div>

            <div style={gridStyle} className="ag-theme-alpine pt-60">
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
                    domLayout={"autoHeight"}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default PortGroupTable;
