import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { interfaceColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllInterfacesOfDeviceURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const InterfaceDataTable = (props) => {
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();
    // setDisableConfig(true);

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
    const { selectedDeviceIp = "" } = props;
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [configStatus, setConfigStatus] = useState("");

    const instance = interceptor();

    useEffect(() => {
        if (selectedDeviceIp) {
            setInterfaceData();
        }
    }, [selectedDeviceIp]);

    const setInterfaceData = () => {
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
        setChanges([]);
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
            console.log(payload);
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
                setInterfaceData();
                setTimeout(resetConfigStatus, 5000);
            })
            .finally(() => {
                setChanges([]);
                setDataTable([]);
                setInterfaceData();
                setLog(true);
                setDisableConfig(false);
            });
    };

    return (
        <div className="datatable">
            <div className="stickyButton">
                <button
                    onClick={sendUpdates}
                    disabled={
                        disableConfig || Object.keys(changes).length === 0
                    }
                    className="btnStyle "
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
                    columnDefs={interfaceColumns}
                    defaultColDef={defaultColDef}
                    stopEditingWhenCellsLoseFocus={true}
                    onCellValueChanged={handleCellValueChanged}
                    quickFilterText="Ethernet"
                    domLayout={"autoHeight"}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default InterfaceDataTable;
