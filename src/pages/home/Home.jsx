import React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
    deviceUserColumns,
    defaultColDef,
} from "../../components/tabbedpane/datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllDevicesURL } from "../../utils/backend_rest_urls.js";
import Modal from "../../components/modal/Modal";

import interceptor from "../../utils/interceptor.js";

import { deleteDevicesURL } from "../../utils/backend_rest_urls.js";
import useStoreConfig from "../../utils/configStore.js";
import useStoreLogs from "../../utils/store.js";
import "./home.scss";

export const Home = () => {
    const instance = interceptor();

    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const [dataTable, setDataTable] = useState([]);
    const [selectedDeviceToDelete, setSelectedDeviceToDelete] = useState("");
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    const updateLog = useStoreLogs((state) => state.updateLog);
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    useEffect(() => {
        getDevices();
    }, []);

    useEffect(() => {
        if (updateLog) {
            getDevices();
        }
    }, [updateLog]);

    const getDevices = () => {
        setUpdateConfig(true);

        setDataTable([]);
        instance(getAllDevicesURL())
            .then((res) => {
                setDataTable(res.data);
                setUpdateConfig(false);
            })
            .catch((err) => {
                console.log(err);
                setUpdateConfig(false);
            });
    };

    const onCellClicked = useCallback((params) => {
        if (params.event.target.tagName === "BUTTON") {
            setSelectedDeviceToDelete(params.data.mgt_ip);
        }
    }, []);

    const handleDeleteCancellation = () => {
        setSelectedDeviceToDelete("");
    };

    const handleDeleteConfirmation = () => {
        setUpdateConfig(true);
        const apiPUrl = deleteDevicesURL();
        instance
            .delete(apiPUrl, { data: { mgt_ip: selectedDeviceToDelete } })
            .then((res) => {})
            .catch((err) => {})
            .finally(() => {
                setUpdateConfig(false);
                setUpdateLog(true);
                setSelectedDeviceToDelete("");
                getDevices();
            });
    };

    return (
        <div>
            <div className="listContainer">
                <div className="listTitle">
                    Devices
                    <div>
                        <button className="btnStyle ">Apply config</button>
                    </div>
                </div>
                <div className="resizable">
                    <div className="datatable" id="dataTable">
                        <div style={gridStyle} className="ag-theme-alpine">
                            <AgGridReact
                                ref={gridRef}
                                rowData={dataTable}
                                columnDefs={deviceUserColumns("home")}
                                defaultColDef={defaultColDef}
                                domLayout={"autoHeight"}
                                enableCellTextSelection="true"
                                onCellClicked={onCellClicked}
                            ></AgGridReact>
                        </div>

                        {selectedDeviceToDelete && (
                            <Modal
                                show={selectedDeviceToDelete}
                                onClose={handleDeleteCancellation}
                            >
                                <div>
                                    <p className="mb-10">
                                        Device {selectedDeviceToDelete}, its
                                        components and links will be removed
                                    </p>
                                    <button
                                        disabled={updateConfig}
                                        id="removeYesBtn"
                                        className="btnStyle mt-10 mr-10"
                                        onClick={handleDeleteConfirmation}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        disabled={updateConfig}
                                        id="removeNoBtn"
                                        className="btnStyle mt-10"
                                        onClick={handleDeleteCancellation}
                                    >
                                        No
                                    </button>
                                </div>
                            </Modal>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
