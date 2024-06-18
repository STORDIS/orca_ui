import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "../tabbedPaneTable.scss";
import MclagForm from "./mclagForm";

import { mclagColumns, defaultColDef } from "../datatablesourse";
import { getAllMclagsOfDeviceURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import Modal from "../../modal/Modal";

import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import { getIsStaff } from "../datatablesourse";

const McLagDataTable = (props) => {
    const instance = interceptor();

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
    const { selectedDeviceIp = "" } = props;
    const [dataTable, setDataTable] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [configStatus, setConfigStatus] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [changes, setChanges] = useState({});
    const [isMessageModalOpen, setIsMessageModalOpen] = useState("null");
    const [modalContent, setModalContent] = useState("");
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();

    useEffect(() => {
        getMclag();
    }, [selectedDeviceIp]);

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            setChanges([]);
            getMclag();
        }
        props.reset(false);
    }, [props.refresh]);

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
        setIsMessageModalOpen("null");
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

    const handleFormSubmit = (formData, status) => {
        console.log(formData, status);
        setDisableConfig(true);
        const apiPUrl = getAllMclagsOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiPUrl, formData)
            .then((res) => {
                setModalContent("Mclag " + status + "ed Successfully");
                setConfigStatus("Config Successful");
            })
            .catch((err) => {
                setModalContent("Error in " + status + "ing Mclag");
                setConfigStatus("Config Failed");
            })
            .finally(() => {
                setShowForm(false);
                setLog(true);
                setDisableConfig(false);
                setIsMessageModalOpen("message");
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
                setIsMessageModalOpen("message");
                setModalContent("Mclag Deleted Successfully");
                setConfigStatus("Config Successful");
            })
            .catch((err) => {
                setIsMessageModalOpen("message");
                setModalContent("Error Deleting Mclag");
                setConfigStatus("Config Failed");
            })
            .finally(() => {
                setShowForm(false);
                setIsMessageModalOpen("message");
                setLog(true);
                setDisableConfig(false);
                setSelectedRows([]);
                setTimeout(resetConfigStatus, 5000);
            });
    };

    const handleCellValueChanged = useCallback((params) => {
        if (
            !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(
                params.data.mclag_sys_mac
            )
        ) {
            alert("Invalid MAC address.");
            return;
        }

        if (!/^PortChannel\d+$/.test(params.data.peer_link)) {
            alert("Invalid peer_link format.");
            return;
        }
        if (
            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                params.data.source_address
            )
        ) {
            alert("Invalid source_address format.");
            return;
        }
        if (
            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                params.data.peer_addr
            )
        ) {
            alert("Invalid peer_addr format.");
            return;
        }
        if (params.newValue !== params.oldValue) {
            let payload = {
                mgt_ip: selectedDeviceIp,
                ...params.data,
            };

            setChanges(payload);
        }
    }, []);

    const onColumnResized = useCallback((params) => {}, []);

    const handleDelete = () => {
        setIsMessageModalOpen("delete");

        selectedRows.forEach((element) => {
            console.log(element.domain_id);
            setModalContent(
                "Do you want to delete Mclag with id " + element.domain_id
            );
        });
    };

    return (
        <div className="datatable">
            <div className="button-group">
                <div className="button-column">
                    <button
                        disabled={
                            disableConfig || Object.keys(changes).length === 0
                        }
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
                    <button
                        className="btnStyle"
                        disabled={!getIsStaff()}
                        onClick={openAddModal}
                    >
                        Add Mclag
                    </button>

                    <button
                        className="ml-10 btnStyle"
                        disabled={selectedRows.length === 0}
                        // onClick={deleteMclag}
                        onClick={handleDelete}
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
                    stopEditingWhenCellsLoseFocus={true}
                    onCellValueChanged={handleCellValueChanged}
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
                    onSubmit={(e) => handleFormSubmit(e, "Add")}
                    selectedDeviceIp={selectedDeviceIp}
                    onCancel={handleCancel}
                    handelSubmitButton={disableConfig}
                />
            </Modal>

            {isMessageModalOpen === "message" && (
                <Modal show={true}>
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

            {isMessageModalOpen === "delete" && (
                <Modal show={true}>
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
                            <button className="btnStyle" onClick={deleteMclag}>
                                Yes
                            </button>
                            <button className="btnStyle" onClick={refreshData}>
                                No
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default McLagDataTable;
