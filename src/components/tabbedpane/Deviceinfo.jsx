import { useEffect, useState } from "react";
import "./tabbedPaneTable.scss";
import { deviceUserColumns } from "./datatablesourse";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllDevicesURL } from "../../utils/backend_rest_urls.js";
import interceptor from "../../utils/interceptor.js";
import useStoreLogs from "../../utils/store";
import useStoreConfig from "../../utils/configStore.js";

const Deviceinfo = (props) => {
    const selectedDeviceIp = props.selectedDeviceIp;
    const [changes, setChanges] = useState(undefined);
    const [dataTable, setDataTable] = useState([]);
    const instance = interceptor();
    const [configStatus, setConfigStatus] = useState("");

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    useEffect(() => {
        getDeviceDetails();
    }, [selectedDeviceIp]);

    const getDeviceDetails = () => {
        instance(getAllDevicesURL())
            .then((res) => {
                let data = res.data.filter(
                    (item) => item.mgt_ip === selectedDeviceIp
                );
                setDataTable(data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        if (props.refresh && changes !== undefined) {
            setDataTable([]);
            getDeviceDetails();
        }
        props.reset(false);
    }, [props.refresh]);

    const sendUpdates = () => {
        setConfigStatus("Applying changes...");
        setChanges(undefined);
    };

    const handleChange = (e) => {
        setChanges(e.target.value);
    };

    return (
        <div className="datatable" id="deviceDataTable">
            <div className="mt-15 mb-15">
                <button
                    onClick={sendUpdates}
                    disabled={updateConfig || changes === undefined}
                    className="btnStyle"
                    id="applyConfigBtn"
                >
                    Apply Config
                </button>
                <span className="config-status" id="configStatus">
                    {configStatus}
                </span>
            </div>
            <div>
                <table
                    style={{
                        borderCollapse: "collapse",
                        border: "1px solid #ddd",
                    }}
                >
                    <tbody>
                        {deviceUserColumns(true).map((column, index) => (
                            <tr key={index}>
                                <td
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                    }}
                                >
                                    {column.headerName}:
                                </td>
                                {dataTable.map((dataRow, rowIndex) => (
                                    <td
                                        key={rowIndex}
                                        style={{
                                            border: "1px solid #ddd",
                                            padding: "8px",
                                        }}
                                    >
                                        {column.headerName === "Sync Time" ? (
                                            <select
                                                className="p-5 w-75"
                                                onChange={handleChange}
                                            >
                                                <option value="10">
                                                    10 Minutes
                                                </option>
                                                <option value="20">
                                                    20 Minutes
                                                </option>
                                                <option value="30">
                                                    30 Minutes
                                                </option>
                                            </select>
                                        ) : (
                                            dataRow[column.field]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Deviceinfo;
