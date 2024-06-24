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
    const { selectedDeviceIp = "" } = props;
    const [changes, setChanges] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [configStatus, setConfigStatus] = useState("");

    const instance = interceptor();
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();

    useEffect(() => {
        getPortGroups();
    }, [selectedDeviceIp]);

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            setChanges([]);
            getPortGroups();
        }
        props.reset(false);
    }, [props.refresh]);

    const getPortGroups = () => {
        setChanges([]);
        setDataTable([]);
        const apiMUrl = getPortGroupsURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => {
                setDataTable(res.data);
            })
            .catch((err) => console.log(err));
    };

    const onColumnResized = useCallback((params) => {}, []);

    const handleCellValueChanged = useCallback((params) => {
        if (params.newValue !== params.oldValue) {
            let payload = {
                ...params.data,
                mgt_ip: selectedDeviceIp,
            };
            setChanges(payload);
        }
    }, []);

    const resetConfigStatus = () => {
        setConfigStatus("");
    };

    const sendUpdates = () => {
        if (changes.length === 0) {
            return;
        }
        setDisableConfig(true);
        setConfigStatus("Config In Progress....");

        const apiUrl = getPortGroupsURL(selectedDeviceIp);
        instance
            .put(apiUrl, changes)
            .then((res) => {
                setConfigStatus("Config Successful");
                setTimeout(resetConfigStatus, 5000);
            })
            .catch((err) => {
                setConfigStatus("Config Failed");
                setTimeout(resetConfigStatus, 5000);
            })
            .finally(() => {
                setChanges([]);
                setLog(true);
                setDisableConfig(false);
            });
    };

    return (
        <div className="datatable">
            <div className="stickyButton">
                <button
                    type="button"
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
