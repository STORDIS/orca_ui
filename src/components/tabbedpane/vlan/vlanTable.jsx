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
    const [dataTable, setDataTable] = useState([]);

    const [configStatus, setConfigStatus] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [changes, setChanges] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState("null");
    const [modalContent, setModalContent] = useState("");
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const selectedDeviceIp = props.selectedDeviceIp;

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            getVlans();
        }
        props.reset(false);
    }, [props.refresh]);

    useEffect(() => {
        getVlans();
    }, [selectedDeviceIp]);

    const getVlans = () => {
        setDataTable([]);
        const apiMUrl = getVlansURL(selectedDeviceIp);
        instance
            .get(apiMUrl)
            .then((res) => {
                let tableData = res.data.map((data) => {
                    data.mem_ifs = JSON.stringify(data.mem_ifs);

                    if (data.autostate === null) {
                        data.autostate = "disable";
                    }

                    return data;
                });

                setDataTable(tableData);
            })
            .catch((err) => {
                console.log(err);
                setDataTable([]);
            });
    };

    const deleteVlan = () => {
        setDisableConfig(true);
        setConfigStatus("Config In Progress....");

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
            })
            .catch((err) => {})
            .finally(() => {
                setLog(true);
                setDisableConfig(false);
                setSelectedRows([]);
                resetConfigStatus();
                refreshData();
            });
    };

    const handleFormSubmit = (formData, status) => {
        setDisableConfig(true);
        setConfigStatus("Config In Progress....");

        const apiMUrl = getVlansURL(selectedDeviceIp);
        instance
            .put(apiMUrl, formData)
            .then(() => {})
            .catch(() => {})
            .finally(() => {
                setLog(true);
                setDisableConfig(false);
                setSelectedRows([]);
                resetConfigStatus();
                refreshData();
            });
    };

    const handleDelete = () => {
        setIsModalOpen("delete");

        let nameArray = [];
        selectedRows.forEach((element) => {
            nameArray.push(element.name + " ");
        });
        setModalContent("Do you want to delete Vlan with id " + nameArray);
    };

    const resetConfigStatus = () => {
        setConfigStatus("");
    };

    const defaultColDef = {
        tooltipValueGetter: (params) => {
            return params.value;
        },
        resizable: true,
    };

    const refreshData = () => {
        getVlans();
        setIsModalOpen("null");
    };

    const openAddFormModal = () => {
        setIsModalOpen("add");
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
            refreshData();
            return;
        }
        if (
            !isValidIPv4WithCIDR(params.data.sag_ip_address) &&
            params.data.sag_ip_address !== "" &&
            params.data.sag_ip_address !== null
        ) {
            alert("sag_ip_address is not valid");
            setSelectedRows([]);
            refreshData();
            return;
        }
        if (params.data.sag_ip_address && params.data.ip_address) {
            alert("ip_address or sag_ip_address any one must be added");
            setSelectedRows([]);
            refreshData();
            return;
        }
        if (params.newValue !== params.oldValue) {
            let payload = {
                ...params.data,
                mgt_ip: selectedDeviceIp,
                mem_ifs: getMembers(params.data.mem_ifs),
            };

            setChanges((prevChanges) => {
                return [...prevChanges, payload];
            });
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
            setIsModalOpen("addMember");
        }
        setSelectedRows(params.data);
    }, []);

    return (
        <div className="datatable-container">
            <div className="datatable">
                <div className="button-group stickyButton">
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
                        <span className="config-status">{configStatus}</span>
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

                <div style={gridStyle} className="ag-theme-alpine pt-60">
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
                        domLayout={"autoHeight"}
                        suppressRowClickSelection={true}
                    ></AgGridReact>
                </div>

                {/* model for adding vlan */}
                {isModalOpen === "add" && (
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
                {isModalOpen === "addMember" && (
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
                {isModalOpen === "delete" && (
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
            </div>
        </div>
    );
};

export default VlanTable;
