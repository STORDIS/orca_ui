import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { vlanColumns } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
    getVlansURL,
    getAllInterfacesOfDeviceURL,
    deleteVlanMembersURL,
} from "../../../utils/backend_rest_urls";
import Modal from "../../modal/Modal";
import VlanForm from "./VlanForm";
import interceptor from "../../../utils/interceptor";
import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const VlanTable = (props) => {
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
        getVlans();
    }, [selectedDeviceIp]);

    const getVlans = () => {
        setDataTable([]);
        const apiMUrl = getVlansURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => {
                res?.data?.forEach((element) => {
                    element.members = JSON.stringify(element.members);
                });
                setDataTable(res?.data);
            })
            .catch((err) => {
                console.log(err);
                setDataTable([]);
            });
    };

    // useEffect(() => {
    //     instance
    //         .get(getAllInterfacesOfDeviceURL(selectedDeviceIp))
    //         .then((response) => {
    //             const fetchedInterfaceNames = response.data.map(
    //                 (item) => item.name
    //             );
    //             setInterfaceNames(fetchedInterfaceNames);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching interface names", error);
    //         });
    // }, []);

    const defaultColDef = {
        tooltipValueGetter: (params) => {
            return params.value;
        },
        resizable: true,
    };

    const deleteVlan = () => {
        setDisableConfig(true);

        const apiMUrl = getVlansURL(selectedDeviceIp);
        const deleteData = selectedRows.map((rowData) => ({
            mgt_ip: selectedDeviceIp,
            name: rowData.name,
        }));
        instance
            .delete(apiMUrl, { data: deleteData })
            .then((response) => {
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
                setModalContent("Vlan Delete Successfully.");
                setConfigStatus("Config Successful");
            })
            .catch((err) => {
                setModalContent("Error in Deleting Vlan.");
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

    const resetConfigStatus = () => {
        setConfigStatus("");
    };

    const handleFormSubmit = (formData, status) => {
        setDisableConfig(true);

        const apiMUrl = getVlansURL(selectedDeviceIp);
        instance
            .put(apiMUrl, formData)
            .then(() => {
                setIsMessageModalOpen("message");
                setModalContent("Valn " + status + "ed Successfully");
                setConfigStatus("Config Successful");
            })
            .catch(() => {
                setIsMessageModalOpen("message");
                setModalContent("Error in " + status + "ing Vlan");
            })
            .finally(() => {
                setShowForm(false);
                // getVlans();
                setLog(true);
                setDisableConfig(false);
                setSelectedRows([]);
                setTimeout(resetConfigStatus, 5000);
            });
    };

    const handleDelete = () => {
        setIsMessageModalOpen("delete");

        selectedRows.forEach((element) => {
            console.log(element);
            setModalContent(
                "Do you want to delete Vlan with id " + element.name
            );
        });
    };

    const refreshData = () => {
        getVlans();
        setIsMessageModalOpen("null");
    };

    const openAddModal = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        console.log("====", selectedData);
        setSelectedRows(selectedData);
    };

    return (
        <div className="datatable-container">
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

                    <button className="btnStyle" onClick={openAddModal}>
                        Add Vlan
                    </button>
                    <button className="btnStyle" onClick={handleDelete}>
                        Delete selected Vlan
                    </button>
                </div>

                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={dataTable}
                        columnDefs={vlanColumns}
                        defaultColDef={defaultColDef}
                        // onCellValueChanged={handleCellValueChanged}
                        rowSelection="multiple"
                        checkboxSelection
                        enableCellTextSelection="true"
                        onSelectionChanged={onSelectionChanged}
                        // onCellClicked={onCellClicked}
                        stopEditingWhenCellsLoseFocus={true}
                    ></AgGridReact>
                </div>

                <Modal
                    show={showForm}
                    onClose={() => setShowForm(false)}
                    title={"Add Vlan"}
                >
                    <VlanForm
                        onSubmit={(e) => handleFormSubmit(e, "Add")}
                        selectedDeviceIp={selectedDeviceIp}
                        onCancel={handleCancel}
                        handelSubmitButton={disableConfig}
                    />
                </Modal>

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
                                <button
                                    className="btnStyle"
                                    onClick={deleteVlan}
                                >
                                    Yes
                                </button>
                                <button
                                    className="btnStyle"
                                    onClick={refreshData}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

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
                                <button
                                    className="btnStyle"
                                    onClick={refreshData}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* {isMemberSelectionModalOpen && (
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
                )} */}
            </div>
        </div>
    );
};

export default VlanTable;
