import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../tabbedPaneTable.scss";
import { stpColumn } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Modal from "../../modal/Modal";
import interceptor from "../../../utils/interceptor";

import useStoreConfig from "../../../utils/configStore";
import { getIsStaff } from "../datatablesourse";
import { stpURL } from "../../../utils/backend_rest_urls";
import StpForm from "./stpForm";

export const getStpDataUtil = (selectedDeviceIp) => {
    const instance = interceptor();
    const apiUrl = stpURL(selectedDeviceIp);
    return instance
        .get(apiUrl)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.log(err);
            return []; // Return an empty array on error
        });
};

const StpDataTable = (props) => {
    const instance = interceptor();

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
    const [dataTable, setDataTable] = useState([]);

    const [configStatus, setConfigStatus] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [changes, setChanges] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState("null");
    const [modalContent, setModalContent] = useState("");
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    const selectedDeviceIp = props.selectedDeviceIp;

    useEffect(() => {
        if (props.refresh && Object.keys(changes).length !== 0) {
            getStp();
        }
        props.reset(false);
    }, [props.refresh]);

    useEffect(() => {
        getStp();
    }, [selectedDeviceIp]);

    const getStp = () => {
        getStpDataUtil(selectedDeviceIp).then((data) => {
            console.log(data);
        });
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

    const onSelectionChanged = () => {};

    const handleCellValueChanged = () => {};

    const onCellClicked = useCallback((params) => {}, []);

    const handleFormSubmit = (formData) => {};

    const refreshData = () => {
        getStp();
        setChanges([]);
        setIsModalOpen("null");
    };

    const openAddFormModal = () => {
        setIsModalOpen("addStpForm");
    };

    return (
        <div className="datatable-container">
            <div className="datatable">
                <div className="button-group stickyButton">
                    <div className="button-column">
                        <button
                            disabled={updateConfig || changes.length === 0}
                            className="btnStyle"
                        >
                            Apply Config
                        </button>
                        <span className="config-status">{configStatus}</span>
                    </div>

                    <button
                        className="btnStyle"
                        onClick={openAddFormModal}
                        disabled={!getIsStaff()}
                    >
                        Add STP
                    </button>
                    <button
                        className="btnStyle"
                        disabled={selectedRows.length === 0}
                    >
                        Delete selected Vlan
                    </button>
                </div>

                <div style={gridStyle} className="ag-theme-alpine pt-60">
                    <AgGridReact
                        ref={gridRef}
                        rowData={dataTable}
                        columnDefs={stpColumn}
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

                {/* model for adding STP */}
                {isModalOpen === "addStpForm" && (
                    <Modal show={true} onClose={refreshData} title={"Add STP"}>
                        <StpForm
                            onSubmit={(e) => handleFormSubmit(e)}
                            selectedDeviceIp={selectedDeviceIp}
                            onCancel={refreshData}
                        />
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default StpDataTable;
