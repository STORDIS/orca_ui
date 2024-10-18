import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { portGroupColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { getPortGroupsURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import useStoreConfig from "../../../utils/configStore";
import useStoreLogs from "../../../utils/store";
import { FaSyncAlt } from "react-icons/fa";
import { syncFeatureCommon } from "../Deviceinfo";

const PortGroupTable = (props) => {
    const gridRef = useRef();
    const [changes, setChanges] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [configStatus, setConfigStatus] = useState("");

    const instance = interceptor();
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    const selectedDeviceIp = props.selectedDeviceIp;
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            setChanges([]);
            setDataTable([]);

            getPortgroup();
        }
        props.reset(false);
    }, [props.refresh]);

    const getPortgroup = () => {
        const apiMUrl = getPortGroupsURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
            })
            .catch((err) => console.log(err));
    };

    const getPortgroup = () => {
        const apiMUrl = getPortGroupsURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => {
                setDataTable(res.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        setChanges([]);
        getPortgroup();
    }, [selectedDeviceIp]);

    const handleCellValueChanged = useCallback((params) => {
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
                        (val) => val.port_group_id === params.data.port_group_id
                    );
                    prev[existedIndex][params.colDef.field] = params.newValue;
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
    }, []);

    const resetConfigStatus = () => {
        setConfigStatus("");
        setChanges([]);
        getPortgroup();
    };

    const createReqJson = useCallback(() => {
        return changes.map((change) => ({
            mgt_ip: selectedDeviceIp,
            port_group_id: change.port_group_id,
            ...change,
        }));
    }, [selectedDeviceIp, changes]);

    const sendUpdates = () => {
        console.log(changes);

        // if (changes.length === 0) {
        //     return;
        // }
        // setUpdateConfig(true);
        // setConfigStatus("Config In Progress....");

        // const req_json = createReqJson();
        // const apiUrl = getPortGroupsURL(selectedDeviceIp);
        // instance
        //     .put(apiUrl, req_json)
        //     .then((res) => {})
        //     .catch((err) => {})
        //     .finally(() => {
        //         setChanges([]);
        //         resetConfigStatus();
        //         setUpdateLog(true);
        //         setUpdateConfig(false);
        //     });
    };

    const gridStyle = useMemo(
        () => ({
            height: props.height - 75 + "px",
            width: "100%",
        }),
        [props.height]
    );

    const resyncPortGroup = async () => {
        let payload = {
            mgt_ip: selectedDeviceIp,
            feature: "port_group",
        };
        setConfigStatus("Sync In Progress....");
        await syncFeatureCommon(payload, (status) => {
            setUpdateConfig(status);
            setUpdateLog(!status);
            if (!status) {
                resetConfigStatus();
            }
        });
    };

    return (
        <div className="datatable">
            <div className="mt-5 mb-5">
                <button
                    className="btnStyle m-10"
                    onClick={resyncPortGroup}
                    disabled={updateConfig}
                >
                    <FaSyncAlt /> Rediscover
                </button>

                <button
                    type="button"
                    onClick={sendUpdates}
                    disabled={updateConfig || Object.keys(changes).length === 0}
                    className="btnStyle m-10"
                >
                    Apply Config
                </button>
                <span className="config-status">{configStatus}</span>
            </div>

            <div style={gridStyle} className="ag-theme-alpine ">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={portGroupColumns}
                    defaultColDef={defaultColDef}
                    stopEditingWhenCellsLoseFocus={true}
                    onCellValueChanged={handleCellValueChanged}
                    enableCellTextSelection="true"
                ></AgGridReact>
            </div>
        </div>
    );
};

export default PortGroupTable;
