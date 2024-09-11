import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { interfaceColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
    getAllInterfacesOfDeviceURL,
    breakoutURL,
    subInterfaceURL,
} from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";

import useStoreLogs from "../../../utils/store";
import useStoreConfig from "../../../utils/configStore";

import { isValidIPv4WithCIDR } from "../../../utils/common";

// Function to get interface names
export const getInterfaceDataCommon = (selectedDeviceIp) => {
    const instance = interceptor();

    const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
    return instance
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

            return items;
        })
        .catch((err) => {
            console.log(err);
            return []; // Return an empty array on error
        });
};

const InterfaceDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
    const selectedDeviceIp = props.selectedDeviceIp;
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [configStatus, setConfigStatus] = useState("");

    const instance = interceptor();
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    // const setUpdateStatus = useStoreLogs((state) => state.setUpdateStatus);
    //  onSuccess({ success: true });
    useEffect(() => {
        if (selectedDeviceIp) {
            getInterfaceData();
        }
    }, [selectedDeviceIp]);

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            setChanges([]);
            getInterfaceData();
        }
        props.reset(false);
    }, [props.refresh]);

    const getInterfaceData = () => {
        setDataTable([]);
        setChanges([]);
        getInterfaceDataCommon(selectedDeviceIp).then((res) => {
            setDataTable(res);
        });
    };

    const resetConfigStatus = () => {
        setConfigStatus("");
        setChanges([]);
        setDataTable([]);
        getInterfaceData();
    };

    const getAdvSpeed = (params) => {
        let result = "all";

        if (params?.includes("SPEED_")) {
            let numericalPart = params.split("_")[1].slice(0, -2);
            result = parseInt(numericalPart) * 1000;
            result = result.toString();
        } else {
            result = "all";
        }
        return result;
    };

    const handleCellValueChanged = useCallback((params) => {
        console.log(params.data.ip_address);
        if (
            !isValidIPv4WithCIDR(params.data.ip_address) &&
            params.data.ip_address !== "" &&
            params.data.ip_address !== undefined
        ) {
            alert("ip_address is not valid");
            resetConfigStatus();
            return;
        }

        if (params.newValue !== params.oldValue) {
            setChanges((prev) => {
                let latestChanges;
                let isNameExsits = prev.filter(
                    (val) => val.name === params.data.name
                );
                if (isNameExsits.length > 0) {
                    let existedIndex = prev.findIndex(
                        (val) => val.name === params.data.name
                    );
                    if (params.colDef.field === "adv_speeds") {
                        prev[existedIndex][params.colDef.field] = getAdvSpeed(
                            params.newValue
                        );
                    } else {
                        prev[existedIndex][params.colDef.field] =
                            params.newValue;
                    }
                    latestChanges = [...prev];
                } else {
                    if (params.colDef.field === "adv_speeds") {
                        latestChanges = [
                            ...prev,
                            {
                                name: params.data.name,
                                mgt_ip: selectedDeviceIp,
                                [params.colDef.field]: getAdvSpeed(
                                    params.data.adv_speeds
                                ),
                            },
                        ];
                    } else if (params.colDef.field === "breakout_mode") {
                        latestChanges = [
                            ...prev,
                            {
                                name: params.data.name,
                                mgt_ip: selectedDeviceIp,
                                alias: params.data.alias,
                                [params.colDef.field]: params.newValue,
                            },
                        ];
                    } else {
                        latestChanges = [
                            ...prev,
                            {
                                name: params.data.name,
                                mgt_ip: selectedDeviceIp,
                                [params.colDef.field]: params.newValue,
                            },
                        ];
                    }
                }

                return latestChanges;
            });
        }
    }, []);

    function hasOnlyRequiredKeys(jsonObject) {
        const requiredKeys = ["mgt_ip", "name", "breakout_mode", "alias"];
        const keys = Object.keys(jsonObject);

        // Check if the keys in jsonObject match exactly with the requiredKeys
        const hasOnlyRequiredKeys =
            keys.length === requiredKeys.length &&
            keys.every((key) => requiredKeys.includes(key));

        return hasOnlyRequiredKeys;
    }

    const sendUpdates = () => {
        if (changes.length === 0) {
            return;
        }

        changes.forEach((item) => {
            if (hasOnlyRequiredKeys(item)) {
                let payload = {
                    mgt_ip: selectedDeviceIp,
                    if_name: item.name,
                    if_alias: item.alias,
                    breakout_mode: item.breakout_mode,
                };

                if (item.breakout_mode === "None") {
                    deleteBreakout(payload);
                } else {
                    putBreakout(payload);
                }
            } else if (
                !hasOnlyRequiredKeys(item) &&
                item.hasOwnProperty("breakout_mode")
            ) {
                let payload = {
                    mgt_ip: selectedDeviceIp,
                    if_name: item.name,
                    if_alias: item.alias,
                    breakout_mode: item.breakout_mode,
                };

                if (item.breakout_mode === "None") {
                    deleteBreakout(payload);
                } else {
                    putBreakout(payload);
                }

                if (
                    item.hasOwnProperty("ip_address") &&
                    (item.ip_address === "" || item.ip_address === null)
                ) {
                    delete item.ip_address;
                    deleteIpAddress(item);
                }

                putConfig(changes);
            } else if (
                item.hasOwnProperty("ip_address") &&
                (item.ip_address === "" || item.ip_address === null)
            ) {
                delete item.ip_address;
                deleteIpAddress(item);
                putConfig(item);
            } else {
                console.log("put");
                putConfig(changes);
            }
        });
    };

    const putConfig = (payload) => {
        setUpdateConfig(true);
        setConfigStatus("Config In Progress....");
        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiUrl, payload)
            .then((res) => {
                resetConfigStatus();
            })
            .catch((err) => {
                getInterfaceData();
                resetConfigStatus();
            })
            .finally(() => {
                getInterfaceData();
                setUpdateLog(true);
                setUpdateConfig(false);
            });
    };

    const putBreakout = (payload) => {
        setUpdateConfig(true);
        setConfigStatus("Config In Progress....");
        const apiUrl = breakoutURL(selectedDeviceIp);
        instance
            .put(apiUrl, payload)
            .then((res) => {
                resetConfigStatus();
            })
            .catch((err) => {
                getInterfaceData();
                resetConfigStatus();
            })
            .finally(() => {
                getInterfaceData();
                setUpdateLog(true);
                setUpdateConfig(false);
            });
    };

    const deleteIpAddress = (payload) => {
        setUpdateConfig(true);
        setConfigStatus("Config In Progress....");
        const apiMUrl = subInterfaceURL();
        instance
            .delete(apiMUrl, { data: payload })
            .then((response) => {})
            .catch((err) => {})
            .finally(() => {
                setUpdateLog(true);
                setUpdateConfig(false);

                resetConfigStatus();
            });
    };

    const deleteBreakout = (payload) => {
        setUpdateConfig(true);
        setConfigStatus("Config In Progress....");
        const apiUrl = breakoutURL(selectedDeviceIp);
        instance
            .delete(apiUrl, { data: payload })
            .then((res) => {
                resetConfigStatus();
            })
            .catch((err) => {
                getInterfaceData();
                resetConfigStatus();
            })
            .finally(() => {
                getInterfaceData();
                setUpdateLog(true);
                setUpdateConfig(false);
            });
    };

    return (
        <div className="datatable" id="interfaceDataTable">
            <div className="stickyButton">
                <button
                    onClick={sendUpdates}
                    disabled={updateConfig || Object.keys(changes).length === 0}
                    className="btnStyle"
                    id="applyConfigBtn"
                >
                    Apply Config
                </button>
                <span className="config-status" id="configStatus">
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
                    domLayout={"autoHeight"}
                    enableCellTextSelection="true"
                    quickFilterText="Ethernet"
                ></AgGridReact>
            </div>
        </div>
    );
};

export default InterfaceDataTable;
