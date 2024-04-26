import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "../tabbedPaneTable.scss";
import MclagForm from "./mclagForm";

import { mclagColumns, defaultColDef } from "../datatablesourse";
import { getAllMclagsOfDeviceURL } from "../../../backend_rest_urls";
import interceptor from "../../../interceptor";
import Modal from "../../modal/Modal";

import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const McLagDataTable = (props) => {
    const instance = interceptor();

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const { rows, columns, selectedDeviceIp = "" } = props;

    const [dataTable, setDataTable] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [configStatus, setConfigStatus] = useState("");

    const [selectedRows, setSelectedRows] = useState([]);

    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const [modalContent, setModalContent] = useState("");

    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();

    useEffect(() => {
        getMclag();
    }, [selectedDeviceIp]);

    const getMclag = () => {
        setDataTable([]);
        const apiMUrl = getAllMclagsOfDeviceURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => setDataTable(res.data))
            .catch((err) => console.log(err));
    };

    const refreshData = () => {
        getMclag();
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

    const handleFormSubmit = (formData) => {
        console.log(formData);
        setDisableConfig(true);

        const apiPUrl = getAllMclagsOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiPUrl, formData)
            .then((res) => {
                setModalContent("Mclag Added Successfully");
                setConfigStatus("Config Successful");
            })
            .catch((err) => {
                setModalContent("Error in Adding Mclag");
                setConfigStatus("Config Failed");
            })
            .finally(() => {
                setShowForm(false);
                setIsMessageModalOpen(true);
                setLog(true);
                setDisableConfig(false);
                setIsMessageModalOpen(true);
                setTimeout(resetConfigStatus, 5000);
            });
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        console.log("====", selectedData);
        setSelectedRows(selectedData);
    };

    const deleteMclag = () => {
        setDisableConfig(true);

        const output = {
            mgt_ip: selectedDeviceIp,
        };

        const apiPUrl = getAllMclagsOfDeviceURL(selectedDeviceIp);
        instance
            .delete(apiPUrl, { data: output })
            .then((res) => {
                setModalContent("Mclag Deleted Successfully");
                setConfigStatus("Config Successful");
            })
            .catch((err) => {
                setModalContent("Error Deleting Mclag");
                setConfigStatus("Config Failed");
            })
            .finally(() => {
                setShowForm(false);
                setIsMessageModalOpen(true);
                setLog(true);
                setDisableConfig(false);
                setSelectedRows([]);
                setTimeout(resetConfigStatus, 5000);
            });
    };

    const onColumnResized = useCallback((params) => {}, []);

    return (
        <div className="datatable">
            <div className="button-group">
                <div className="button-column">
                    <button disabled={disableConfig} className="btnStyle">
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
                    columnDefs={mclagColumns}
                    defaultColDef={defaultColDef}
                    onColumnResized={onColumnResized}
                    checkboxSelection
                    enableCellTextSelection="true"
                    rowSelection="single"
                    onSelectionChanged={onSelectionChanged}
                ></AgGridReact>
            </div>

            <Modal
                show={showForm}
                onClose={() => setShowForm(false)}
                title={"Add Mclag"}
            >
                <MclagForm
                    onSubmit={handleFormSubmit}
                    selectedDeviceIp={selectedDeviceIp}
                    onCancel={handleCancel}
                    handelSubmitButton={disableConfig}
                />
            </Modal>

            {isMessageModalOpen && (
                <Modal show={isMessageModalOpen}>
                    <div>
                        {modalContent}
                        <div
                            style={{
                                marginTop: "10px",
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                        >
                            <button className="btnStyle" onClick={refreshData}>
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default McLagDataTable;
