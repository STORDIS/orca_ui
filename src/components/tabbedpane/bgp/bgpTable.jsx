import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { bgpColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllBGPOfDeviceURL } from "../../../utils/backend_rest_urls";

import interceptor from "../../../utils/interceptor";
import Modal from "../../modal/Modal";

import BgpForm from "./bgpForm";
import { getIsStaff } from "../../../utils/common";
import useStoreLogs from "../../../utils/store";
import useStoreConfig from "../../../utils/configStore";
import { FaSyncAlt } from "react-icons/fa";
import { syncFeatureCommon } from "../Deviceinfo";

const BGPTable = (props) => {
    const instance = interceptor();

    const gridRef = useRef();
    const selectedDeviceIp = props.selectedDeviceIp;

    const [dataTable, setDataTable] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [configStatus, setConfigStatus] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [changes, setChanges] = useState({});
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

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
                res?.data?.forEach((element) => {
                    element.neighbor_prop = JSON.stringify(
                        element?.neighbor_prop
                    );
                });
                setDataTable(res.data);
            })
            .catch((err) => {});
    };

    const reload = () => {
        getBgp();
        setIsMessageModalOpen(false);
        setConfigStatus("");
        setShowForm(false);
        setSelectedRows([]);
    };

    const openAddModal = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const deleteBgp = () => {
        const output = {
            mgt_ip: selectedDeviceIp,
            vrf_name: selectedRows.pop().vrf_name,
        };

        setUpdateConfig(true);
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
                setIsMessageModalOpen(true);
                setUpdateLog(true);
                setUpdateConfig(false);
                reload();
            });
    };

    const handleFormSubmit = (formData, status) => {
        setUpdateConfig(true);
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
                setUpdateLog(true);
                setUpdateConfig(false);
                setIsMessageModalOpen(true);
                reload();
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

    const gridStyle = useMemo(
        () => ({
            height: props.height - 75 + "px",
            width: "100%",
        }),
        [props.height]
    );

    const resyncBgp = async () => {
        let payload = {
            mgt_ip: selectedDeviceIp,
            feature: "bgp",
        };
        setConfigStatus("Sync In Progress....");
        await syncFeatureCommon(payload, (status) => {
            setUpdateConfig(status);
            setUpdateLog(!status);
            if (!status) {
                reload();
            }
        });
    };

    return (
        <div className="datatable">
            <div className="button-group mt-5 mb-5">
                <div>
                    <button
                        className="btnStyle m-10"
                        onClick={resyncBgp}
                        disabled={updateConfig}
                    >
                        <FaSyncAlt /> Rediscover
                    </button>

                    <button
                        disabled={
                            updateConfig || Object.keys(changes).length === 0
                        }
                        className="btnStyle m-10"
                        onClick={() => handleFormSubmit(changes, "Updat")}
                    >
                        Apply Config
                    </button>
                    <span className="config-status">{configStatus}</span>
                </div>

                <div>
                    <button
                        className="btnStyle m-10"
                        disabled={!getIsStaff()}
                        onClick={openAddModal}
                    >
                        Add BGP
                    </button>

                    <button
                        className="btnStyle m-10"
                        disabled={selectedRows.length === 0}
                        onClick={deleteBgp}
                    >
                        Delete BGP
                    </button>
                </div>
            </div>

            <div style={gridStyle} className="ag-theme-alpine ">
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
                <Modal show={isMessageModalOpen} onClose={reload}>
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
                            <button className="btnStyle" onClick={reload}>
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
