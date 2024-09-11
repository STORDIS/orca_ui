import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Modal from "../../modal/Modal";

import { portChannelColumns, defaultColDef } from "../datatablesourse";
import {
    getAllPortChnlsOfDeviceURL,
    deletePortchannelIpURL,
} from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import PortChannelForm from "./PortChannelForm";
import PortChMemberForm from "./portChMemberForm";
import PortChVlanForm from "./PortChVlanForm";
import "../tabbedPaneTable.scss";
import useStoreLogs from "../../../utils/store";

import { getIsStaff } from "../../../utils/common";
import useStoreConfig from "../../../utils/configStore";

import { isValidIPv4WithCIDR } from "../../../utils/common";

export const getPortChannelDataCommon = (selectedDeviceIp) => {
    const instance = interceptor();
    const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
    return instance
        .get(apiPUrl)
        .then((res) => {
            let data = res.data.map((data) => {
                data.members = JSON.stringify(data.members);
                data.vlan_members = JSON.stringify(data.vlan_members);
                return data;
            });

            return data;
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
};

const PortChDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(
        () => ({ height: "90%", width: "100%", maxWidth: "100%" }),
        []
    );
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [configStatus, setConfigStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState("null");
    const [modalContent, setModalContent] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const instance = interceptor();

    const selectedDeviceIp = props.selectedDeviceIp;
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            setChanges([]);
            getAllPortChanalData();
        }
        props.reset(false);
    }, [props.refresh]);

    useEffect(() => {
        getAllPortChanalData();
    }, [selectedDeviceIp]);

    const getAllPortChanalData = () => {
        setDataTable([]);
        setChanges([]);
        getPortChannelDataCommon(selectedDeviceIp).then((res) => {
            setDataTable(res);
        });
    };

    const refreshData = () => {
        setDataTable([]);
        getAllPortChanalData();
        setIsModalOpen("null");
        setSelectedRows([]);
    };

    const deletePortchannel = () => {
        setUpdateConfig(true);

        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        const deleteData = selectedRows.map((rowData) => ({
            mgt_ip: selectedDeviceIp,
            lag_name: rowData.lag_name,
        }));
        instance
            .delete(apiPUrl, { data: deleteData })
            .then((response) => {
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
            })
            .catch((err) => {})
            .finally(() => {
                refreshData();
                setUpdateConfig(false);
                setUpdateLog(true);
            });
    };

    const resetConfigStatus = () => {
        setConfigStatus("");
        setChanges([]);

        gridRef.current.api.deselectAll();
        setSelectedRows([]);
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
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

            console.log(params.colDef.field, params.newValue)

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
                    prev[existedIndex][params.colDef.field] =
                        params.newValue ;
                    latestChanges = [...prev];
                } else {
                    latestChanges = [
                        ...prev,
                        {
                            mgt_ip: selectedDeviceIp,
                            lag_name: params.data.lag_name,
                            [params.colDef.field]: params.newValue ,
                        },
                    ];
                }
                return latestChanges;
            });
        }
    }, []);

    const onCellClicked = useCallback((params) => {
        if (params?.colDef?.field === "members") {
            setIsModalOpen("addPortchannelMembers");
        }
        if (params?.colDef?.field === "vlan_members") {
            setIsModalOpen("addPortchannelVlan");
        }
        setSelectedRows(params.data);
    }, []);

    const handleFormSubmit = (formData) => {
        if (Array.isArray(formData)) {
            formData.forEach((obj) => {
                obj.mgt_ip = selectedDeviceIp;
            });
            formData?.forEach((element) => {
                if (
                    element.hasOwnProperty("ip_address") &&
                    (element.ip_address === "" || element.ip_address === null)
                ) {
                    delete element.ip_address;
                    deleteIpAddress(element);
                    putConfig(element);
                } else {
                    putConfig(element);
                }
            });
        } else {
            putConfig(formData);
        }
    };

    const deleteIpAddress = (payload) => {
        setUpdateConfig(true);
        setConfigStatus("Config In Progress....");
        const apiMUrl = deletePortchannelIpURL();
        instance
            .delete(apiMUrl, { data: payload })
            .then((response) => {})
            .catch((err) => {})
            .finally(() => {
                setUpdateLog(true);
                setUpdateConfig(false);
                setSelectedRows([]);
                resetConfigStatus();
                refreshData();
            });
    };

    const putConfig = (formData) => {
        setUpdateConfig(true);
        setConfigStatus("Config In Progress....");
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiPUrl, formData)
            .then((res) => {
                resetConfigStatus();
            })
            .catch((err) => {
                resetConfigStatus();
            })
            .finally(() => {
                getAllPortChanalData();
                setUpdateLog(true);
                setUpdateConfig(false);
                setIsModalOpen("null");
            });
    };

    const openAddFormModal = () => {
        setIsModalOpen("addPortchannel");
    };

    const handleDelete = () => {
        setIsModalOpen("deletePortChannel");

        let nameArray = [];
        selectedRows?.forEach((element) => {
            nameArray.push(element?.lag_name + " ");
        });
        setModalContent(
            "Do you want to delete Portchannel with id " + nameArray
        );
    };

    return (
        <div className="datatable-container" id="portChannelDataTable">
            <div className="datatable">
                <div className="button-group stickyButton">
                    <div className="button-column">
                        <button
                            onClick={() => handleFormSubmit(changes)}
                            disabled={
                                updateConfig ||
                                Object.keys(changes).length === 0
                            }
                            className="btnStyle"
                            id="applyConfigBtn"
                        >
                            Apply Config
                        </button>
                        <span className="config-status" id="configStatus">
                            {configStatus}
                        </span>
                    </div>

                    <button
                        className="btnStyle"
                        disabled={!getIsStaff()}
                        onClick={openAddFormModal}
                        id="addPortchannelBtn"
                    >
                        Add Port Channel
                    </button>
                    <button
                        className="btnStyle"
                        onClick={handleDelete}
                        disabled={
                            selectedRows.length === 0 ||
                            selectedRows.length === undefined
                        }
                        id="deletePortChannelBtn"
                    >
                        Delete Selected Port Channel
                    </button>
                </div>

                <div style={gridStyle} className="ag-theme-alpine pt-60">
                    <AgGridReact
                        ref={gridRef}
                        rowData={dataTable}
                        columnDefs={portChannelColumns}
                        defaultColDef={defaultColDef}
                        stopEditingWhenCellsLoseFocus={true}
                        onCellValueChanged={handleCellValueChanged}
                        domLayout={"autoHeight"}
                        enableCellTextSelection="true"
                        onSelectionChanged={onSelectionChanged}
                        onCellClicked={onCellClicked}
                        rowSelection="multiple"
                        suppressRowClickSelection={true}
                    ></AgGridReact>
                </div>

                {/* add port channel */}
                {isModalOpen === "addPortchannel" && (
                    <Modal
                        show={true}
                        onClose={refreshData}
                        title={"Add Port Channel"}
                        onSubmit={handleFormSubmit}
                        id="addPortchannel"
                    >
                        <PortChannelForm selectedDeviceIp={selectedDeviceIp} />
                    </Modal>
                )}

                {/* ethernet member selection */}
                {isModalOpen === "addPortchannelMembers" && (
                    <Modal
                        show={true}
                        onClose={refreshData}
                        title="Select Member Interfaces"
                        onSubmit={(data) => {
                            handleFormSubmit(data);
                        }}
                        id="addPortchannelMembers"
                    >
                        <PortChMemberForm
                            selectedDeviceIp={selectedDeviceIp}
                            inputData={selectedRows}
                        />
                    </Modal>
                )}

                {/* vlan member selection */}
                {isModalOpen === "addPortchannelVlan" && (
                    <Modal
                        show={true}
                        onClose={refreshData}
                        title="Add Access Vlan"
                        onSubmit={(data) => {
                            handleFormSubmit(data);
                        }}
                        id="addPortchannelVlan"
                    >
                        <PortChVlanForm
                            selectedDeviceIp={selectedDeviceIp}
                            inputData={selectedRows}
                        />
                    </Modal>
                )}

                {/* model for delete confirmation message */}
                {isModalOpen === "deletePortChannel" && (
                    <Modal show={true} onClose={refreshData}>
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
                                    disabled={updateConfig}
                                    onClick={deletePortchannel}
                                    id="removeYesBtn"
                                >
                                    Yes
                                </button>
                                <button
                                    className="btnStyle"
                                    onClick={refreshData}
                                    id="removeNoBtn"
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

export default PortChDataTable;
