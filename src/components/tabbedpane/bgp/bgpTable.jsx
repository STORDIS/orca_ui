import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { bgpColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllBGPOfDeviceURL } from "../../../backend_rest_urls";

import interceptor from "../../../interceptor";
import Modal from "../../modal/Modal";
import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const BGPTable = (props) => {
    const instance = interceptor();

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const { rows, columns, selectedDeviceIp = "" } = props;

    const [dataTable, setDataTable] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [configStatus, setConfigStatus] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [changes, setChanges] = useState({});
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();

    useEffect(() => {
        getBgp();
    }, []);

    const getBgp = () => {
        setDataTable([]);
        const apiMUrl = getAllBGPOfDeviceURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => {
                // get neighbor_prop property from json and convert to string
                res.data.forEach((element) => {
                    element.neighbor_prop = JSON.stringify(
                        element.neighbor_prop
                    );
                });
                setDataTable(res.data);
            })
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
    };

    const refreshData = () => {
        getBgp();
        setIsMessageModalOpen(false);
    };

    const openAddModal = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const resetConfigStatus = () => {
        setConfigStatus("");
    };

    const deleteMclag = () => {};
    const handleFormSubmit = (formData, status) => {};

    const onColumnResized = useCallback((params) => {}, []);

    return (
        <div className="datatable">
            <div className="button-group">
                <div className="button-column">
                    <button
                        disabled={disableConfig}
                        className="btnStyle"
                        onClick={() => handleFormSubmit(changes, "Updat")}
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

                <div className="">
                    <button className="btnStyle" onClick={openAddModal}>
                        Add Mclag
                    </button>

                    <button
                        className="ml-10 btnStyle"
                        disabled={selectedRows.length === 0}
                        onClick={deleteMclag}
                    >
                        Delete Mclag
                    </button>
                </div>
            </div>

            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={bgpColumns}
                    defaultColDef={defaultColDef}
                    onColumnResized={onColumnResized}
                    checkboxSelection
                    enableCellTextSelection="true"
                ></AgGridReact>
            </div>
        </div>
    );
};

export default BGPTable;
