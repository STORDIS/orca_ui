import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { vlanColumns } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getVlansURL, removeVlanIp } from "../../../utils/backend_rest_urls";
import Modal from "../../modal/Modal";
import VlanForm from "./VlanForm";
import VlanMemberForm from "./vlanMemberForm";
import VlanSagIpForm from "./vlanSagIpForm";
import interceptor from "../../../utils/interceptor";
import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import { getIsStaff } from "../datatablesourse";

// Function to get vlan names
export const getVlanDataUtil = (selectedDeviceIp) => {
    const instance = interceptor();
    const apiUrl = getVlansURL(selectedDeviceIp);
    return instance
        .get(apiUrl)
        .then((res) => {
            let items = res.data.map((data) => {
                data.mem_ifs = JSON.stringify(data.mem_ifs);

                if (data.autostate === null) {
                    data.autostate = "disable";
                }

                return data;
            });
            return items;
        })
        .catch((err) => {
            console.log(err);
            return []; // Return an empty array on error
        });
};

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
        getVlanDataUtil(selectedDeviceIp).then((res) => {
            setDataTable(res);
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

    const hasOnlyAllowedKeys = (obj) => {
        const allowedKeys = [
            "mgt_ip",
            "name",
            "vlanid",
            "sag_ip_address",
            "ip_address",
        ];
        const objKeys = Object.keys(obj);

        // Check if objKeys only contains allowed keys
        const containsOnlyAllowedKeys = objKeys.every((key) =>
            allowedKeys.includes(key)
        );

        // Check if obj contains either "sag_ip_address" or "ip_address" or both
        const containsRequiredIpKey =
            obj.hasOwnProperty("sag_ip_address") ||
            obj.hasOwnProperty("ip_address");

        return containsOnlyAllowedKeys && containsRequiredIpKey;
    };

    const handleFormSubmit = (formData) => {
        if (Array.isArray(formData)) {
            formData.forEach((element) => {
                if (
                    !hasOnlyAllowedKeys(element) &&
                    (element.sag_ip_address === null ||
                        element.sag_ip_address === "" ||
                        element.ip_address === null ||
                        element.ip_address === "")
                ) {
                    deleteIpAddress(element);

                    delete element.sag_ip_address;
                    delete element.ip_address;

                    putConfig(element);
                    return;
                } else if (
                    hasOnlyAllowedKeys(element) &&
                    (element.ip_address === null || element.ip_address === "")
                ) {
                    deleteIpAddress(element);
                } else {
                    putConfig(element);
                }
            });
        } else {
            putConfig(formData);
        }
    };

    const putConfig = (formData) => {
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

    const deleteIpAddress = (payload) => {
        setDisableConfig(true);
        setConfigStatus("Config In Progress....");
        const apiMUrl = removeVlanIp();
        instance
            .delete(apiMUrl, { data: payload })
            .then((response) => {})
            .catch((err) => {})
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
        setChanges([]);
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

        if (params.data.sag_ip_address && params.data.ip_address) {
            alert("ip_address or sag_ip_address any one must be added");
            setSelectedRows([]);
            refreshData();
            return;
        }
        if (params.newValue !== params.oldValue) {
            setChanges((prev) => {
                let latestChanges;
                let isNameExsits = prev.filter(
                    (val) => val.vlanid === params.data.vlanid
                );
                if (isNameExsits.length > 0) {
                    let existedIndex = prev.findIndex(
                        (val) => val.vlanid === params.data.vlanid
                    );
                    prev[existedIndex][params.colDef.field] =
                        params.newValue || "";
                    latestChanges = [...prev];
                } else {
                    latestChanges = [
                        ...prev,
                        {
                            mgt_ip: selectedDeviceIp,
                            name: params.data.name,
                            vlanid: params.data.vlanid,
                            [params.colDef.field]: params.newValue || "",
                        },
                    ];
                }
                return latestChanges;
            });
        }
    }, []);

    const onCellClicked = useCallback((params) => {
        if (params?.colDef?.field === "mem_ifs") {
            setIsModalOpen("addMember");
        }
        if (
            params?.colDef?.field === "sag_ip_address" &&
            (params.data.ip_address === "" || params.data.ip_address === null)
        ) {
            setIsModalOpen("vlanSagIpForm");
        }
        setSelectedRows(params.data);
    }, []);

    return (
        <div className="datatable-container">
            <div className="datatable">
                <div className="button-group stickyButton">
                    <div className="button-column">
                        <button
                            disabled={disableConfig || changes.length === 0}
                            className="btnStyle"
                            onClick={() => handleFormSubmit(changes)}
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
                        disabled={
                            selectedRows.length === 0 ||
                            selectedRows.length === undefined
                        }
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

                {/* model for editing sag ip */}
                {isModalOpen === "vlanSagIpForm" && (
                    <Modal
                        show={true}
                        onClose={refreshData}
                        title={"Edit Sag Ip"}
                        onSubmit={refreshData}
                    >
                        <VlanSagIpForm
                            selectedDeviceIp={selectedDeviceIp}
                            inputData={selectedRows}
                        />
                    </Modal>
                )}

                {/* model for adding vlan */}
                {isModalOpen === "add" && (
                    <Modal
                        show={true}
                        onClose={refreshData}
                        title={"Add Vlan"}
                        onSubmit={(e) => handleFormSubmit(e)}
                    >
                        <VlanForm selectedDeviceIp={selectedDeviceIp} />
                    </Modal>
                )}

                {/* model for adding interfaces */}
                {isModalOpen === "addMember" && (
                    <Modal
                        show={true}
                        onClose={refreshData}
                        title="Select Interfaces"
                        onSubmit={(e) => handleFormSubmit(e)}
                    >
                        <VlanMemberForm
                            selectedDeviceIp={selectedDeviceIp}
                            inputData={selectedRows}
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
