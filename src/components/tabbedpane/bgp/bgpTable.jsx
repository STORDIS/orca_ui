import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { bgpColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllBGPOfDeviceURL } from "../../../utils/backend_rest_urls";

import interceptor from "../../../utils/interceptor";
import Modal from "../../modal/Modal";
import { useLog } from "../../../utils/logpannelContext";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import BgpForm from "./bgpForm";
import { getIsStaff } from "../datatablesourse";

const BGPTable = (props) => {
    const instance = interceptor();

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
    const selectedDeviceIp = props.selectedDeviceIp;

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
    }, [selectedDeviceIp]);

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            setChanges([]);
            getBgp();
        }
        props.reset(false);
    }, [props.refresh]);

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

    const deleteBgp = () => {
        const output = {
            mgt_ip: selectedDeviceIp,
            vrf_name: selectedRows.pop().vrf_name,
        };

        setDisableConfig(true);
        const apiPUrl = getAllBGPOfDeviceURL(selectedDeviceIp);
        setConfigStatus("Config In Progress....");
        instance
            .delete(apiPUrl, { data: output })
            .then((res) => {
                setModalContent("BGP Deleted Successfully");
            })
            .catch((err) => {
                setModalContent("Error Deleting BGP");
            })
            .finally(() => {
                setShowForm(false);
                setIsMessageModalOpen(true);
                setLog(true);
                setDisableConfig(false);
                setSelectedRows([]);
                resetConfigStatus();
            });
    };

    const handleFormSubmit = (formData, status) => {
        setDisableConfig(true);
        setConfigStatus("Config In Progress....");
        const apiPUrl = getAllBGPOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiPUrl, formData)
            .then((res) => {
                setModalContent("Bgp " + status + "ed Successfully");
            })
            .catch((err) => {
                setModalContent("Error in " + status + "ing Bgp");
            })
            .finally(() => {
                setShowForm(false);
                setIsMessageModalOpen(true);
                setLog(true);
                setDisableConfig(false);
                setIsMessageModalOpen(true);
                resetConfigStatus();
            });
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
    };

    const handleCellValueChanged = useCallback((params) => {
        if (params.newValue !== params.oldValue) {
            let payload = {
                mgt_ip: selectedDeviceIp,
                vrf_name: params.data.vrf_name,
                local_asn: params.data.local_asn,
                router_id: params.data.router_id,
            };
            setChanges(payload);
        }
    }, []);

    const onColumnResized = useCallback((params) => {}, []);

    return (
        <div className="datatable">
            <div className="button-group stickyButton">
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
                    <span className="config-status">{configStatus}</span>
                </div>

                <div className="">
                    <button
                        className="btnStyle"
                        disabled={!getIsStaff()}
                        onClick={openAddModal}
                    >
                        Add BGP
                    </button>

                    <button
                        className="ml-10 btnStyle"
                        disabled={selectedRows.length === 0}
                        onClick={deleteBgp}
                    >
                        Delete BGP
                    </button>
                </div>
            </div>

            <div style={gridStyle} className="ag-theme-alpine pt-60">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={bgpColumns}
                    defaultColDef={defaultColDef}
                    stopEditingWhenCellsLoseFocus={true}
                    enableCellTextSelection="true"
                    rowSelection="multiple"
                    onSelectionChanged={onSelectionChanged}
                    onCellValueChanged={handleCellValueChanged}
                    domLayout={"autoHeight"}
                    suppressRowClickSelection={true}
                ></AgGridReact>
            </div>

            <Modal
                show={showForm}
                onClose={() => setShowForm(false)}
                title={"Add BGP"}
                onSubmit={(e) => handleFormSubmit(e, "Add")}
            >
                <BgpForm selectedDeviceIp={selectedDeviceIp} />
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

export default BGPTable;
