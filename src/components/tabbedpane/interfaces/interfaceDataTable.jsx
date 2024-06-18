import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { interfaceColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllInterfacesOfDeviceURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

// { selectedDeviceIp, refresh, reset }

const InterfaceDataTable = (props) => {
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const selectedDeviceIp = props.selectedDeviceIp;

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);

    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [configStatus, setConfigStatus] = useState("");

    const instance = interceptor();

    useEffect(() => {
        getInterfaceData();
    }, [selectedDeviceIp]);

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            setChanges([]);
            getInterfaceData();
            console.log("check");
        }
        props.reset(false);
    }, [props.refresh]);

    const getInterfaceData = () => {
        setDataTable([]);
        setChanges([]);

        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        instance
            .get(apiUrl)
            .then((res) => {
                let items = res.data.map((item) => {
                    if (item.adv_speeds !== "all" && item.adv_speeds !== "") {
                        item.adv_speeds =
                            "SPEED_" + parseInt(item.adv_speeds) / 1000 + "GB";
                    } else {
                        item.adv_speeds = "all";
                    }

                    return item;
                });

                setDataTable(items);
            })
            .catch((err) => {
                console.log(err);
                setDataTable([]);
            });
    };

    const resetConfigStatus = () => {
        setConfigStatus("");
    };

    const getAdvSpeed = (params) => {
        let result = "all";

        if (params.includes("SPEED_")) {
            let numericalPart = params.split("_")[1].slice(0, -2);
            result = parseInt(numericalPart) * 1000;
            result = result.toString();
        } else {
            result = "all";
        }
        return result;
    };

    const handleCellValueChanged = useCallback((params) => {
        if (params.newValue !== params.oldValue) {
            let payload = {
                ...params.data,
                adv_speeds: getAdvSpeed(params.data.adv_speeds),
                mgt_ip: selectedDeviceIp,
            };
            setChanges(payload);
        }
    }, []);

    const sendUpdates = () => {
        if (changes.length === 0) {
            return;
        }
        setDisableConfig(true);
        setConfigStatus("Config In Progress....");
        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiUrl, changes)
            .then((res) => {
                setConfigStatus("Config Successful");
                setTimeout(resetConfigStatus, 5000);
            })
            .catch((err) => {
                setConfigStatus("Config Failed");
                getInterfaceData();
                setTimeout(resetConfigStatus, 5000);
            })
            .finally(() => {
                setChanges([]);
                setDataTable([]);
                getInterfaceData();
                setLog(true);
                setDisableConfig(false);
            });
    };

    return (
        <div className="datatable">
            <button
                onClick={sendUpdates}
                disabled={disableConfig || Object.keys(changes).length === 0}
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
            <p>&nbsp;</p>

            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={interfaceColumns}
                    defaultColDef={defaultColDef}
                    stopEditingWhenCellsLoseFocus={true}
                    onCellValueChanged={handleCellValueChanged}
                    quickFilterText="Ethernet"
                ></AgGridReact>
            </div>
        </div>
    );
};

export default InterfaceDataTable;
