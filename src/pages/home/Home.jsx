import React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  deviceUserColumns,
  defaultColDef,
} from "../../components/tabbedpane/datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  getAllDevicesURL,
  switchImageURL,
  deleteDevicesURL,
} from "../../utils/backend_rest_urls.js";
import Modal from "../../components/modal/Modal";

import interceptor from "../../utils/interceptor.js";

import useStoreConfig from "../../utils/configStore.js";
import useStoreLogs from "../../utils/store.js";
import "./home.scss";

import { getIsStaff } from "../../utils/common";

export const Home = () => {
  const instance = interceptor();

  const deviceTableRef = useRef(null);

  const [dataTable, setDataTable] = useState([]);
  const [selectedDeviceToDelete, setSelectedDeviceToDelete] = useState("");
  const [selectedDeviceToUpdate, setSelectedDeviceToUpdate] = useState([]);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);

  const updateLog = useStoreLogs((state) => state.updateLog);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  const [heightDeviceTable, setHeightDeviceTable] = useState(250);

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    if (updateLog) {
      getDevices();
    }
  }, [updateLog]);

  const getDevices = () => {
    setDataTable([]);
    instance(getAllDevicesURL())
      .then((res) => {
        setDataTable(res.data);
      })
      .catch((err) => {
        console.error(err);
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

  const handleCellValueChanged = useCallback((params) => {
    if (params.newValue !== params.oldValue) {
      setSelectedDeviceToUpdate((prev) => {
        let latestChanges;
        let isNameExsits = prev.filter(
          (item) => item.mgt_ip === params.data.mgt_ip
        );
        if (isNameExsits.length > 0) {
          let existedIndex = prev.findIndex(
            (item) => item.mgt_ip === params.data.mgt_ip
          );
          prev[existedIndex].image_name = params.newValue || "";
          latestChanges = [...prev];
        } else {
          latestChanges = [
            ...prev,
            {
              mgt_ip: params.data.mgt_ip,
              image_name: params.newValue,
            },
          ];
        }
        return latestChanges;
      });
    }
  }, []);

  const sendUpdates = () => {
    setUpdateConfig(true);
    const apiUrl = switchImageURL();
    instance
      .put(apiUrl, selectedDeviceToUpdate)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setUpdateLog(true);
        setUpdateConfig(false);
        setSelectedDeviceToUpdate([]);
      });
  };

  const handleResizeDeviceTable = () => {
    if (deviceTableRef.current.offsetHeight > 250) {
      setHeightDeviceTable(deviceTableRef.current.offsetHeight);
    }
  };

  const gridStyleDataTable = useMemo(
    () => ({ height: heightDeviceTable + "px", width: "100%" }),
    [heightDeviceTable]
  );

  return (
    <div>
      <div className="listContainer">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="listTitle">Devices</span>
          <div>
            <button
              className="btnStyle "
              onClick={sendUpdates}
              disabled={updateConfig || !getIsStaff()}
            >
              Apply config
            </button>
            <button
              className="btnStyle ml-15"
              onClick={getDevices}
              disabled={!getIsStaff()}
            >
              Refresh
            </button>
          </div>
        </div>

        <div
          className="datatable resizable mt-15"
          id="dataTable"
          ref={deviceTableRef}
          onMouseMove={handleResizeDeviceTable}
        >
          <div style={gridStyleDataTable} className="ag-theme-alpine">
            <AgGridReact
              rowData={dataTable}
              columnDefs={deviceUserColumns("home")}
              defaultColDef={defaultColDef}
              enableCellTextSelection="true"
              onCellClicked={onCellClicked}
              stopEditingWhenCellsLoseFocus={true}
              onCellValueChanged={handleCellValueChanged}
            ></AgGridReact>
          </div>
        </div>
        {selectedDeviceToDelete && (
          <Modal
            show={selectedDeviceToDelete}
            onClose={handleDeleteCancellation}
          >
            <div>
              <p className="mb-10">
                Device {selectedDeviceToDelete}, its components and links will
                be removed
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
  );
};
export default Home;
