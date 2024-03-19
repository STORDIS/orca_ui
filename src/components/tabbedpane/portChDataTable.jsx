import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { portChannelColumns } from "./datatablesourse";
import axios from "axios";
import {
    getAllInterfacesOfDeviceURL,
    getAllPortChnlsOfDeviceURL,
} from "../../backend_rest_urls";
import PortChannelForm from "../PortChannelForm";
import Modal from "../modal/Modal";
//import MemberSelectionComponent from "./MemberSelectionComponent";
import MembersSelection from "./MembersSelection";
import { useLog } from "../../LogContext";
import interceptor from "../../interceptor";

const PortChDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(
        () => ({ height: "90%", width: "100%", maxWidth: "100%" }),
        []
    );
    const { selectedDeviceIp = "" } = props;
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isConfigInProgress, setIsConfigInProgress] = useState(false);
    const [configStatus, setConfigStatus] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalType, setModalType] = useState("success");
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
        useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [currentRowData, setCurrentRowData] = useState(null);
    const [interfaceNames, setInterfaceNames] = useState([]);
    const [existingMembers, setExistingMembers] = useState([]);

    const { setLog } = useLog();
    const instance = interceptor();
    const [disableSubmit, setDisableSubmit] = useState(false);

    useEffect(() => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        instance
            .get(apiPUrl)
            .then((res) => {
                let data = res.data;
                data &&
                    data.map(
                        (val) => (val["members"] = val["members"].toString())
                    );
                setDataTable(data);
                setOriginalData(JSON.parse(JSON.stringify(data)));
            })
            .catch((err) => console.log(err));
    }, [selectedDeviceIp]);

    useEffect(() => {
        instance
            .get(getAllInterfacesOfDeviceURL(selectedDeviceIp))
            .then((res) => {
                const names = res.data.map((item) => item.name);
                setInterfaceNames(names);
            })
            .catch((error) =>
                console.error("Failed to fetch interface names:", error)
            );
    }, [selectedDeviceIp]);

    useEffect(() => {
        if (props.refresh) {
            props.setRefresh(!props.refresh);
            setDataTable(JSON.parse(JSON.stringify(originalData)));
            setChanges([]);
        }
    }, [props.refresh]);

    const defaultColDef = {
        tooltipValueGetter: (params) => {
            return params.value;
        },
        resizable: true,
    };

    const refreshData = () => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        instance
            .get(apiPUrl)
            .then((res) => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setMessageModalContent("Error fetching data: " + err.message);
                setIsMessageModalOpen(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleOkClick = () => {
        setIsMessageModalOpen(false);
        refreshData();
    };

    const promptDeleteConfirmation = () => {
        setMessageModalContent(getDeleteConfirmationMessage());
        setIsDeleteConfirmationModalOpen(true);
    };

    const handleDeleteConfirmation = () => {
        setIsDeleteConfirmationModalOpen(false);
        handleDelete();
    };

    const handleDeleteCancellation = () => {
        setIsDeleteConfirmationModalOpen(false);
    };

    const handleFormSubmit = (formData) => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiPUrl, formData)
            .then((res) => {
                setShowForm(false);

                let startIndex = res.data.result[0].indexOf("{");
                let endIndex = res.data.result[0].lastIndexOf("}");
                let trimmedResponse = res.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );

                setLog({
                    status: "success",
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });

                setMessageModalContent("Port Channel added Successfully");
                setIsMessageModalOpen(true);
                refreshData();
            })
            .catch((err) => {
                setMessageModalContent("Error adding port channel");
                setIsMessageModalOpen(true);
                let startIndex = err.response.data.result[0].indexOf("{");
                let endIndex = err.response.data.result[0].lastIndexOf("}");
                let trimmedResponse = err.response.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );

                setLog({
                    status: "error",
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });
            });
    };

    const handleDelete = () => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        const deleteData = selectedRows.map((rowData) => ({
            mgt_ip: selectedDeviceIp,
            lag_name: rowData.lag_name,
        }));
        instance
            .delete(apiPUrl, { data: deleteData })
            .then((response) => {
                let startIndex = response.data.result[0].indexOf("{");
                let endIndex = response.data.result[0].lastIndexOf("}");
                let trimmedResponse = response.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );

                setLog({
                    status: "success",
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });

                if (response.data && Array.isArray(response.data.result)) {
                    const updatedDataTable = dataTable.filter(
                        (row) =>
                            !selectedRows.some(
                                (selectedRow) =>
                                    selectedRow.lag_name === row.lag_name
                            )
                    );
                    setDataTable(updatedDataTable);
                }
                setSelectedRows([]);
                setMessageModalContent("Port Channel Deleted Successfully.");
                setIsMessageModalOpen(true);
            })
            .catch((err) => {
                let startIndex = err.response.data.result[0].indexOf("{");
                let endIndex = err.response.data.result[0].lastIndexOf("}");
                let trimmedResponse = err.response.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );
                setLog({
                    status: "error",
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });
            })
            .finally(() => {});
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const getDeleteConfirmationMessage = () => {
        if (selectedRows.length === 1) {
            return `Are you sure you want to delete ${selectedRows[0].lag_name}?`;
        } else if (selectedRows.length > 1) {
            const lagNames = selectedRows.map((row) => row.lag_name).join(", ");
            return `Are you sure you want to delete these port channels: ${lagNames}?`;
        } else {
            return "No port channel selected.";
        }
    };

    const resetConfigStatus = () => {
        setConfigStatus("");
        setChanges([]);

        gridRef.current.api.deselectAll();
        setSelectedRows([]);
    };

    const openAddModal = () => {
        setModalTitle("Add Port Channel");
        setShowForm(true);
    };

    const openDeleteModal = () => {
        setModalTitle("Delete Port Channel");
        promptDeleteConfirmation();
    };

    const handleCellValueChanged = useCallback((params) => {
        if (params.newValue !== params.oldValue) {
            if (params.colDef.field === "lag_name") {
                if (!/^PortChannel\d+$/.test(params.newValue)) {
                    alert(
                        'Invalid lag_name format. It should follow the pattern "PortChannel..." where "..." is a numeric value.'
                    );
                    params.node.setDataValue("lag_name", params.oldValue);
                    return;
                }
            }
            setChanges((prev) => {
                if (!Array.isArray(prev)) {
                    console.error("Expected array but got:", prev);
                    return [];
                }
                let latestChanges;
                let isNameExsits = prev.filter(
                    (val) => val.lag_name === params.data.lag_name
                );
                if (isNameExsits.length > 0) {
                    let existedIndex = prev.findIndex(
                        (val) => val.lag_name === params.data.lag_name
                    );
                    prev[existedIndex][params.colDef.field] = params.newValue;
                    latestChanges = [...prev];
                } else {
                    latestChanges = [
                        ...prev,
                        {
                            lag_name: params.data.lag_name,
                            [params.colDef.field]: params.newValue,
                        },
                    ];
                }
                return latestChanges;
            });
        }
    }, []);

    const createJsonOutput = useCallback(() => {
        let output = changes.map((change) => {
            let members = change.members;
            if (
                Array.isArray(members) &&
                members.length > 0 &&
                Array.isArray(members[0])
            ) {
                members = members.flat();
            }

            return {
                mgt_ip: selectedDeviceIp,
                lag_name: change.lag_name,
                ...change,
                members,
            };
        });

        return output;
    }, [selectedDeviceIp, changes]);

    const sendUpdates = useCallback(() => {
        if (changes.length === 0) {
            return;
        }
        setIsConfigInProgress(true);
        setConfigStatus("Config In Progress....");

        const output = createJsonOutput();
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiPUrl, output)
            .then((res) => {
                let startIndex = res.data.result[0].indexOf("{");
                let endIndex = res.data.result[0].lastIndexOf("}");
                let trimmedResponse = res.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );
                setLog({
                    status: "success",
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });
                setConfigStatus("Config Successful");
                setTimeout(resetConfigStatus, 5000);
            })
            .catch((err) => {
                let startIndex = err?.response?.data?.result[0]?.indexOf("{");
                let endIndex = err?.response?.data?.result[0]?.lastIndexOf("}");
                let trimmedResponse = err?.response?.data?.result[0]?.substring(
                    startIndex + 1,
                    endIndex
                );
                setLog({
                    status: "error",
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });
                setConfigStatus("Config Failed");
                setTimeout(resetConfigStatus, 5000);
            })
            .finally(() => {
                setIsConfigInProgress(false);
            });
    }, [changes.length, createJsonOutput, selectedDeviceIp, instance, setLog]);

    const onCellClicked = useCallback((params) => {
        if (params?.colDef?.field === "members") {
            setCurrentRowData(params?.data);
            setExistingMembers(params?.data?.members);
            setIsMemberModalOpen(true);
        }
    }, []);

    const handleMembersSave = (selectedMembers) => {
        const updatedData = dataTable.map((row) => {
            if (row.lag_name === currentRowData.lag_name) {
                return { ...row, members: selectedMembers };
            }
            return row;
        });
        setDataTable(updatedData);

        const changeIndex = changes.findIndex(
            (change) => change.lag_name === currentRowData.lag_name
        );
        if (changeIndex !== -1) {
            const updatedChanges = [...changes];
            updatedChanges[changeIndex] = {
                ...updatedChanges[changeIndex],
                members: selectedMembers,
            };
            setChanges(updatedChanges);
        } else {
            setChanges([
                ...changes,
                {
                    lag_name: currentRowData.lag_name,
                    members: selectedMembers,
                },
            ]);
        }
        sendUpdates();
        setIsMemberModalOpen(false);
    };

    return (
        <div className="datatable-container">
            <div className="datatable">
                <div className="button-group">
                    <div className="button-column">
                        <button
                            onClick={sendUpdates}
                            disabled={
                                isConfigInProgress || changes.length === 0
                            }
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

                    <button className="btnStyle" onClick={openAddModal}>
                        Add Port Channel
                    </button>
                    <button
                        className="btnStyle"
                        onClick={openDeleteModal}
                        disabled={selectedRows.length === 0}
                    >
                        Delete Selected Port Channel
                    </button>
                </div>
                <p>&nbsp;</p>
                <Modal
                    show={showForm}
                    onClose={() => setShowForm(false)}
                    title={modalTitle}
                >
                    <PortChannelForm
                        onSubmit={handleFormSubmit}
                        selectedDeviceIp={selectedDeviceIp}
                        onCancel={handleCancel}
                        handelSubmitButton={disableSubmit}
                    />
                </Modal>

                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={dataTable}
                        columnDefs={portChannelColumns}
                        defaultColDef={defaultColDef}
                        onCellValueChanged={handleCellValueChanged}
                        rowSelection="multiple"
                        checkboxSelection
                        enableCellTextSelection="true"
                        onSelectionChanged={onSelectionChanged}
                        onCellClicked={onCellClicked}
                        stopEditingWhenCellsLoseFocus={true}
                    ></AgGridReact>
                </div>
                {isDeleteConfirmationModalOpen && (
                    <Modal
                        show={isDeleteConfirmationModalOpen}
                        onClose={handleDeleteCancellation}
                    >
                        <div>
                            <p>{messageModalContent}</p>
                            <button
                                className="btnStyle mt-10 mr-10"
                                onClick={handleDeleteConfirmation}
                            >
                                Yes
                            </button>
                            <button
                                className="btnStyle mt-10"
                                onClick={handleDeleteCancellation}
                            >
                                No
                            </button>
                        </div>
                    </Modal>
                )}

                {isMessageModalOpen && (
                    <Modal
                        show={isMessageModalOpen}
                        onClose={() => setIsMessageModalOpen(false)}
                    >
                        <div>
                            {messageModalContent}
                            <button
                                className="btnStyle"
                                onClick={() => setIsMessageModalOpen(false)}
                            >
                                OK
                            </button>
                        </div>
                    </Modal>
                )}
                {isMessageModalOpen && (
                    <Modal show={isMessageModalOpen}>
                        <div>
                            {messageModalContent}
                            <div
                                style={{
                                    marginTop: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px",
                                }}
                            >
                                {modalType === "success" ? (
                                    <button onClick={handleOkClick}>OK</button>
                                ) : (
                                    <button
                                        className="btnStyle"
                                        onClick={() =>
                                            setIsMessageModalOpen(false)
                                        }
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        </div>
                    </Modal>
                )}

                {isMemberModalOpen && (
                    <Modal
                        show={isMemberModalOpen}
                        onClose={() => setIsMemberModalOpen(false)}
                        title="Select Member Interfaces"
                    >
                        <MembersSelection
                            interfaceNames={interfaceNames}
                            existingMembers={existingMembers}
                            onSave={(selectedMembers) => {
                                handleMembersSave(selectedMembers);
                                setIsMemberModalOpen(false);
                            }}
                            onCancel={() => setIsMemberModalOpen(false)}
                        />
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default PortChDataTable;
