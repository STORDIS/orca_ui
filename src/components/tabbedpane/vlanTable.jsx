import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss";
import { vlanColumns } from "./datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import {
    getVlansURL,
    getAllInterfacesOfDeviceURL,
    deleteVlanMembersURL,
} from "../../backend_rest_urls";
import "../../pages/home/home.scss";
import Modal from "../modal/Modal";
import VlanForm from "../VlanForm";
import { useLog } from "../../LogContext";

const VlanTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const { selectedDeviceIp = "" } = props;
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isConfigInProgress, setIsConfigInProgress] = useState(false);
    const [configStatus, setConfigStatus] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
        useState(false);
    const [showForm, setShowForm] = useState(false);
    const [modalType, setModalType] = useState("success");
    const [modalTitle, setModalTitle] = useState("");
    const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
    const [interfaceNames, setInterfaceNames] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isMemberSelectionModalOpen, setIsMemberSelectionModalOpen] =
        useState(false);
    const [currentEditingVlan, setCurrentEditingVlan] = useState(null);
    const [member, setMember] = useState("");
    const [showCheckbox, setCheckboxVisible] = useState(false);
    const [isCheckboxChecked, setCheckboxChecked] = useState(false);
    const [memberFinalObj, setMemberFinalObj] = useState({});
    const [membersSelectedForRemoval, setMembersSelectedForRemoval] = useState(
        []
    );
    const { setLog } = useLog();
    const [disableSubmit, setDisableSubmit] = useState(false);

    useEffect(() => {
        const apiMUrl = getVlansURL(selectedDeviceIp);
        axios
            .get(apiMUrl)
            .then((res) => {
                //iterate the json array res.data and convert the value of key "members" in each element to string
                res?.data?.forEach((element) => {
                    element.members = JSON.stringify(element.members);
                });
                setDataTable(res?.data);
            })
            .catch((err) => console.log(err));
    }, [selectedDeviceIp]);

    useEffect(() => {
        axios
            .get(getAllInterfacesOfDeviceURL(selectedDeviceIp))
            .then((response) => {
                const fetchedInterfaceNames = response.data.map(
                    (item) => item.name
                );
                setInterfaceNames(fetchedInterfaceNames);
            })
            .catch((error) => {
                console.error("Error fetching interface names", error);
            });
    }, []);

    const defaultColDef = {
        tooltipValueGetter: (params) => {
            return params.value;
        },
        resizable: true,
    };

    const refreshData = () => {
        const apiMUrl = getVlansURL(selectedDeviceIp);
        axios
            .get(apiMUrl)
            .then((res) => {
                console.log("refresh", res);
                if (res.data !== "") {
                    res.data.forEach((element) => {
                        element.members = JSON.stringify(element.members);
                    });
                    setDataTable(res.data);
                    setOriginalData(JSON.parse(JSON.stringify(res.data)));
                }
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

    const resetConfigStatus = () => {
        setConfigStatus("");
        setChanges([]);
        gridRef.current.api.deselectAll();
        setSelectedRows([]);
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

    const handleDelete = () => {
        const apiMUrl = getVlansURL(selectedDeviceIp);
        const deleteData = selectedRows.map((rowData) => ({
            mgt_ip: selectedDeviceIp,
            name: rowData.name,
        }));
        console.log("DeleteData", deleteData);
        axios
            .delete(apiMUrl, { data: deleteData })
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
                                (selectedRow) => selectedRow.name === row.name
                            )
                    );
                    setDataTable(updatedDataTable);
                }
                setSelectedRows([]);
                setMessageModalContent("Vlan Delete Successfully.");
                setIsMessageModalOpen(true);
            })
            .catch((err) => {
                let startIndex = err.response.data.result[0].indexOf("{");
                let endIndex = err.response.data.result[0].lastIndexOf("}");
                let trimmedResponse = err.response.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );
                const match = err.response.data.result[0].match(/Reason:(.*)/);
                const reasonText = match[1].trim();
                setLog({
                    status: reasonText,
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
        const isAnyRowSelected = selectedNodes.length > 0;
        setIsDeleteButtonEnabled(isAnyRowSelected);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const getDeleteConfirmationMessage = () => {
        if (selectedRows.length === 1) {
            return `Are you sure you want to delete ${selectedRows[0].name}?`;
        } else if (selectedRows.length > 1) {
            const names = selectedRows.map((row) => row.name).join(", ");
            return `Are you sure you want to delete these Vlan: ${names}?`;
        } else {
            return "No Vlan selected.";
        }
    };

    const handleFormSubmit = (formData) => {
        const apiMUrl = getVlansURL(selectedDeviceIp);
        axios
            .put(apiMUrl, formData)
            .then((response) => {
                setShowForm(false);

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

                setMessageModalContent("Vlan added successfully");
                setIsMessageModalOpen(true);
                refreshData();
                // setDisableSubmit(false);
            })
            .catch((err) => {
                setMessageModalContent("Error in adding Vlan");
                setIsMessageModalOpen(true);
                let startIndex = err.response.data.result[0].indexOf("{");
                let endIndex = err.response.data.result[0].lastIndexOf("}");
                let trimmedResponse = err.response.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );
                const match = err.response.data.result[0].match(/Reason:(.*)/);
                const reasonText = match[1].trim();
                setLog({
                    status: reasonText,
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });
                // setDisableSubmit(false);
            });
    };

    const openAddModal = () => {
        setModalTitle("Add Vlan");
        setShowForm(true);
    };

    const openDeleteModal = () => {
        setModalTitle("Delete Vlan");
        promptDeleteConfirmation();
    };

    const handleCellValueChanged = useCallback(
        (params) => {
            if (params.newValue !== params.oldValue) {
                setChanges((prev) => {
                    if (!Array.isArray(prev)) {
                        console.error("Expected array but got:", prev);
                        return [];
                    }
                    let lastestChanges;
                    let isNameExists = prev.filter(
                        (val) => val.name === params.data.name
                    );
                    if (isNameExists.length > 0) {
                        let existedIndex = prev.findIndex(
                            (val) => val.name === params.data.name
                        );
                        prev[existedIndex][params.colDef.field] =
                            params.newValue;
                        lastestChanges = [...prev];
                    } else {
                        lastestChanges = [
                            ...prev,
                            {
                                name: params.data.name,
                                [params.colDef.field]: params.newValue,
                            },
                        ];
                    }
                    return lastestChanges;
                });
            }
        },
        [dataTable]
    );

    useEffect(() => {
        if (props.refresh) {
            props.setRefresh(!props.refresh);
            const apiMUrl = getVlansURL(selectedDeviceIp);
            axios.get(apiMUrl).then((res) => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
            });
            setDataTable();
            setChanges([]);
        }
    }, [props.refresh]);

    const createJSONOutput = useCallback(() => {
        const output = changes
            .map((change) => {
                const originalItem = dataTable.find(
                    (item) => item.name === change.name
                );
                if (!originalItem) {
                    console.error(
                        "Original item not found for change:",
                        change
                    );
                    return null;
                }
                return {
                    mgt_ip: selectedDeviceIp,
                    name: change.name,
                    vlanid: originalItem.vlanid,
                    ...change,
                };
            })
            .filter(Boolean);
        return output;
    }, [selectedDeviceIp, changes, dataTable]);

    const sendUpdates = useCallback(() => {
        if (changes.length === 0) {
            return;
        }
        setIsConfigInProgress(true);
        setConfigStatus("Config In Progress...");

        const output = createJSONOutput();
        const apiMUrl = getVlansURL(selectedDeviceIp);
        axios
            .put(apiMUrl, output)
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
                let startIndex = err.response.data.result[0].indexOf("{");
                let endIndex = err.response.data.result[0].lastIndexOf("}");
                let trimmedResponse = err.response.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );

                const match = err.response.data.result[0].match(/Reason:(.*)/);
                const reasonText = match[1].trim();
                setLog({
                    status: reasonText,
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });

                setConfigStatus("Config Failed");
                setTimeout(resetConfigStatus, 5000);
            })
            .finally(() => {
                setIsConfigInProgress(false);
            });
    }, [createJSONOutput, selectedDeviceIp, changes]);

    const openMemberSelectionModal = (vlanData) => {
        setCurrentEditingVlan(vlanData);
        const existingMembers = vlanData.members
            ? JSON.parse(vlanData.members)
            : {};
        setMemberFinalObj(existingMembers);
        setIsMemberSelectionModalOpen(true);
    };

    const onCellClicked = useCallback((params) => {
        if (params.colDef.field === "members") {
            const members = JSON.parse(params.data.members);
            openMemberSelectionModal(params.data);
            setSelectedMembers(members);
            setIsMemberSelectionModalOpen(true);
        }
    }, []);

    const handleDropdownChange = (e) => {
        if (e.target.value !== "") {
            setMember(e.target.value);
            setCheckboxVisible(true);
            const currentStatus = memberFinalObj[e.target.value];
            setCheckboxChecked(currentStatus === "tagged");
        } else {
            setMember("");
            setCheckboxVisible(false);
        }
    };

    const handleCheckbox = (e) => {
        setCheckboxChecked(e.target.checked);
    };

    const handleBtnClicked = (e) => {
        e.preventDefault();
        setIsConfigInProgress(false);
        if (member) {
            const newStatus = isCheckboxChecked ? "tagged" : "untagged";
            setMemberFinalObj((prev) => ({
                ...prev,
                [member]: newStatus,
            }));

            setMember("");
            setCheckboxVisible(false);
            setCheckboxChecked(false);
        } else {
            alert("Please select a member interface before adding.");
        }
    };

    const resetMemberSelectionModal = () => {
        setMemberFinalObj({});
        setMember("");
        setCheckboxVisible(false);
        setCheckboxChecked(false);
    };

    const convertToObject = (array) => {
        return array.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    };

    const handleSaveMemberSelection = () => {
        const memberSelectionObject = convertToObject(
            Object.entries(memberFinalObj)
        );
        const updatedVlans = dataTable.map((vlan) => {
            if (vlan.name === currentEditingVlan.name) {
                return {
                    ...vlan,
                    members: JSON.stringify(memberSelectionObject),
                };
            }
            return vlan;
        });

        setDataTable(updatedVlans);
        resetMemberSelectionModal();
        setIsMemberSelectionModalOpen(false);

        const output = {
            vlanid: currentEditingVlan.vlanid,
            mgt_ip: selectedDeviceIp,
            name: currentEditingVlan.name,
            members: memberSelectionObject,
        };

        const apiMUrl = getVlansURL(selectedDeviceIp);
        axios
            .put(apiMUrl, output)
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
                let startIndex = err.response.data.result[0].indexOf("{");
                let endIndex = err.response.data.result[0].lastIndexOf("}");
                let trimmedResponse = err.response.data.result[0].substring(
                    startIndex + 1,
                    endIndex
                );

                const match = err.response.data.result[0].match(/Reason:(.*)/);

                const reasonText = match[1].trim();

                setLog({
                    status: reasonText,
                    result: trimmedResponse,
                    timestamp: new Date().getTime(),
                });

                setConfigStatus("Config Failed");
                setTimeout(resetConfigStatus, 5000);
            })
            .finally(() => {
                setIsConfigInProgress(false);
            });
    };

    const handleModalClose = () => {
        resetMemberSelectionModal();
        setIsMemberSelectionModalOpen(false);
    };

    const deleteVlanMembers = async () => {
        if (!currentEditingVlan || membersSelectedForRemoval.length === 0)
            return;
        setIsConfigInProgress(true);
        const updatedMembersObj = { ...memberFinalObj };
        membersSelectedForRemoval.forEach((member) => {
            delete updatedMembersObj[member];
        });

        const payload = {
            mgt_ip: selectedDeviceIp,
            name: currentEditingVlan.name,
            members: updatedMembersObj,
        };

        try {
            const response = await axios.delete(
                deleteVlanMembersURL(selectedDeviceIp),
                { data: payload }
            );
            console.log("VLAN members updated successfully", response.data);

            setMemberFinalObj(updatedMembersObj);
            setMembersSelectedForRemoval([]);
            refreshData();
        } catch (error) {
            console.error("Failed to update VLAN members", error);
        }
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
                        Add Vlan
                    </button>
                    <button
                        className="btnStyle"
                        onClick={openDeleteModal}
                        disabled={!isDeleteButtonEnabled}
                    >
                        Delete selected Vlan
                    </button>
                </div>

                <p>&nbsp;</p>
                <Modal
                    show={showForm}
                    onClose={() => setShowForm(false)}
                    title={modalTitle}
                >
                    <VlanForm
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
                        columnDefs={vlanColumns(interfaceNames)}
                        defaultColDef={defaultColDef}
                        onCellValueChanged={handleCellValueChanged}
                        rowSelection="multiple"
                        checkboxSelection
                        enableCellTextSelection="true"
                        onSelectionChanged={onSelectionChanged}
                        onCellClicked={onCellClicked}
                    ></AgGridReact>
                </div>
                {isDeleteConfirmationModalOpen && (
                    <Modal
                        show={isDeleteConfirmationModalOpen}
                        onClose={handleDeleteCancellation}
                    >
                        <div>
                            <p>{messageModalContent}</p> &nbsp;
                            <button onClick={handleDeleteConfirmation}>
                                Yes
                            </button>{" "}
                            &ensp;
                            <button onClick={handleDeleteCancellation}>
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
                                Ok
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
                                    <button
                                        className="btnStyle"
                                        onClick={handleOkClick}
                                    >
                                        OK
                                    </button>
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

                {isMemberSelectionModalOpen && (
                    <Modal
                        show={isMemberSelectionModalOpen}
                        onClose={handleModalClose}
                        title="Select Member Interfaces"
                    >
                        <div>
                            <div className="selection-container">
                                <select
                                    id="memberDropdown"
                                    onChange={handleDropdownChange}
                                    value={member}
                                >
                                    <option value="" disabled>
                                        Select Member Interface
                                    </option>
                                    {interfaceNames.map((val, index) => (
                                        <option key={index} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                                {showCheckbox && (
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={isCheckboxChecked}
                                            onChange={handleCheckbox}
                                        />
                                        Tagged
                                    </label>
                                )}
                                <button onClick={handleBtnClicked}>
                                    Add Member Interface
                                </button>
                            </div>
                            <div
                                className="remove-selection-container"
                                style={{ marginTop: "20px" }}
                            >
                                <label>Select Members to Remove:</label>
                                <select
                                    multiple
                                    value={membersSelectedForRemoval}
                                    onChange={(e) =>
                                        setMembersSelectedForRemoval(
                                            Array.from(
                                                e.target.selectedOptions,
                                                (option) => option.value
                                            )
                                        )
                                    }
                                    size="5"
                                    style={{ width: "100%" }}
                                >
                                    {Object.keys(memberFinalObj).map(
                                        (member) => (
                                            <option key={member} value={member}>
                                                {member}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            <div
                                style={{
                                    marginTop: "10px",
                                    display: "flex",
                                    gap: "10px",
                                }}
                            >
                                <button
                                    className="btnStyle"
                                    onClick={handleSaveMemberSelection}
                                >
                                    Ok
                                </button>
                                <button
                                    className="btnStyle"
                                    onClick={handleModalClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteVlanMembers}
                                    disabled={
                                        membersSelectedForRemoval.length === 0
                                    }
                                    className="btnStyle"
                                >
                                    Delete Selected Members
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default VlanTable;
