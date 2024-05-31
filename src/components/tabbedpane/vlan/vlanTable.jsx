import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { vlanColumns } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getVlansURL } from "../../../utils/backend_rest_urls";
import Modal from "../../modal/Modal";
import VlanForm from "./VlanForm";
import VlanMemberForm from "./vlanMemberForm";
import interceptor from "../../../utils/interceptor";
import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import { getIsStaff } from "../datatablesourse";

const VlanTable = (props) => {
    const instance = interceptor();

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
    const { selectedDeviceIp = "" } = props;
    const [dataTable, setDataTable] = useState([]);

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
                console.log(res.data);
                res?.data?.forEach((element) => {
                    element.mem_ifs = JSON.stringify(element.mem_ifs);
                });
                setDataTable(res?.data);
            })
            .catch((err) => {
                console.log(err);
                setDataTable([]);
            });
    };

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
                getMessageForApi(status + " Success");
                setConfigStatus("Config Successful");
            })
            .catch(() => {
                setIsMessageModalOpen("message");
                getMessageForApi(status + " Error");
            })
            .finally(() => {
                // getVlans();
                setLog(true);
                setDisableConfig(false);
                setSelectedRows([]);
                setTimeout(resetConfigStatus, 5000);
            });
    };

    const getMessageForApi = (status) => {
        switch (status) {
            case "Add Success":
                setModalContent("Vlan Added Successfully");
                return;
            case "Update Success":
                setModalContent("Vlan Updated Successfully");
                return;
            case "Member Success":
                setModalContent("Vlan Member Added Successfully");
                return;
            case "Add Error":
                setModalContent("Error in Adding Vlan");
                return;
            case "Update Error":
                setModalContent("Error in Updating Vlan");
                return;
            case "Member Error":
                setModalContent("Error in Adding Vlan Member");
                return;
            default:
                return "";
        }
    };

    const handleDelete = () => {
        setIsMessageModalOpen("delete");

        let nameArray = [];
        selectedRows.forEach((element) => {
            nameArray.push(element.name + " ");
        });
        setModalContent("Do you want to delete Vlan with id " + nameArray);
    };

    const refreshData = () => {
        getVlans();
        setIsMessageModalOpen("null");
    };

    const openAddFormModal = () => {
        setIsMessageModalOpen("add");
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
    };

    const isValidIPv4WithCIDR = (ipWithCidr) => {
        if (ipWithCidr) {
            const ipv4Regex =
                /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
            const cidrRegex = /^([0-9]|[12][0-9]|3[0-2])$/;

            const [ip, cidr] = ipWithCidr.split("/");

            if (ipv4Regex.test(ip)) {
                if (cidr === undefined || cidrRegex.test(cidr)) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    };

    const handleCellValueChanged = useCallback((params) => {
        if (
            !isValidIPv4WithCIDR(params.data.ip_address) &&
            params.data.ip_address !== "" &&
            params.data.ip_address !== null
        ) {
            alert("ip_address is not valid");
            setSelectedRows([]);
            return;
        }
        if (
            !isValidIPv4WithCIDR(params.data.sag_ip_address) &&
            params.data.sag_ip_address !== "" &&
            params.data.sag_ip_address !== null
        ) {
            alert("sag_ip_address is not valid");
            setSelectedRows([]);
            return;
        }
        if (params.data.sag_ip_address && params.data.ip_address) {
            alert("ip_address or sag_ip_address any one must be added");
            setSelectedRows([]);
            return;
        }
        if (params.newValue !== params.oldValue) {
            let payload = {
                ...params.data,
                mgt_ip: selectedDeviceIp,
                mem_ifs: getMembers(params.data.mem_ifs),
            };
            setChanges(payload);
        }
    }, []);

    const getMembers = (params) => {
        let temp = JSON.parse(params);

        if (Object.keys(temp).length > 0) {
            return temp;
        } else {
            return {};
        }
    };

    const onCellClicked = useCallback((params) => {
        if (params?.colDef?.field === "mem_ifs") {
            setIsMessageModalOpen("addMember");
        }
    }, []);

    return (
        <div className="datatable-container">
            <div className="datatable">
                <div className="button-group">
                    <div className="button-column">
                        <button
                            disabled={
                                disableConfig ||
                                Object.keys(changes).length === 0
                            }
                            className="btnStyle"
                            onClick={() => handleFormSubmit(changes, "Update")}
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

                    <button
                        className="btnStyle"
                        disabled={!getIsStaff()}
                        onClick={openAddFormModal}
                    >
                        Add Vlan
                    </button>
                    <button
                        className="btnStyle"
                        onClick={handleDelete}
                        disabled={selectedRows.length === 0}
                    >
                        Delete selected Vlan
                    </button>
                </div>

                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={dataTable}
                        columnDefs={vlanColumns}
                        defaultColDef={defaultColDef}
                        onCellValueChanged={handleCellValueChanged}
                        rowSelection="multiple"
                        enableCellTextSelection="true"
                        onSelectionChanged={onSelectionChanged}
                        stopEditingWhenCellsLoseFocus={true}
                        onCellClicked={onCellClicked}
                    ></AgGridReact>
                </div>

                {/* model for adding vlan */}
                {isMessageModalOpen === "add" && (
                    <Modal show={true} onClose={refreshData} title={"Add Vlan"}>
                        <VlanForm
                            onSubmit={(e) => handleFormSubmit(e, "Add")}
                            selectedDeviceIp={selectedDeviceIp}
                            onCancel={refreshData}
                            handelSubmitButton={disableConfig}
                        />
                    </Modal>
                )}
                {/* model for adding interfaces */}
                {isMessageModalOpen === "addMember" && (
                    <Modal
                        show={true}
                        onClose={refreshData}
                        title="Select Interfaces"
                    >
                        <VlanMemberForm
                            onSubmit={(e) => handleFormSubmit(e, "Member")}
                            selectedDeviceIp={selectedDeviceIp}
                            inputData={selectedRows}
                            onCancel={refreshData}
                            handelSubmitButton={disableConfig}
                        />
                    </Modal>
                )}

                {/* model for delete confirmation message */}
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

                {/* model for showing messages*/}
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
            </div>
        </div>
    );
};

export default VlanTable;
