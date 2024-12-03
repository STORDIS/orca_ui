import React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  deviceUserColumns,
  defaultColDef,
  dhcpColumn,
} from "../../components/tabbedpane/datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  getAllDevicesURL,
  switchImageURL,
  dhcpDeviceListURL,
} from "../../utils/backend_rest_urls.js";
import Modal from "../../components/modal/Modal";

import interceptor from "../../utils/interceptor.js";

import { deleteDevicesURL } from "../../utils/backend_rest_urls.js";
import useStoreConfig from "../../utils/configStore.js";
import useStoreLogs from "../../utils/store.js";
import "./home.scss";

import { getIsStaff } from "../../utils/common";

export const Home = () => {
  const instance = interceptor();

  const gridRef = useRef();
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [dataTable, setDataTable] = useState([]);
  const [selectedDeviceToDelete, setSelectedDeviceToDelete] = useState("");
  const [selectedDeviceToUpdate, setSelectedDeviceToUpdate] = useState([]);

  const [dhcpTable, setDhcpTable] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);

  const updateLog = useStoreLogs((state) => state.updateLog);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  useEffect(() => {
    getDevices();
    getDhcpDevices();
  }, []);

  useEffect(() => {
    if (updateLog) {
      getDevices();
      getDhcpDevices();
    }
  }, [updateLog]);

  const getDhcpDevices = () => {
    setDhcpTable([]);
    instance(dhcpDeviceListURL())
      .then((res) => {
        setDhcpTable(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDevices = () => {
    setDataTable([]);
    instance(getAllDevicesURL())
      .then((res) => {
        setDataTable(res.data);
      })
      .catch((err) => {
        console.log(err);
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
    console.log(selectedDeviceToUpdate);

    setUpdateConfig(true);
    const apiUrl = switchImageURL();
    instance
      .put(apiUrl, selectedDeviceToUpdate)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {})
      .finally(() => {
        setUpdateLog(true);
        setUpdateConfig(false);
        setSelectedDeviceToUpdate([]);
      });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const discoverDhcp = () => {
    console.log(selectedRows);
  };

  return (
    <div>
      <div className="listContainer">
        <div className="listTitle">
          Devices
          <div>
            <button
              className="btnStyle "
              onClick={sendUpdates}
              disabled={updateConfig || !getIsStaff()}
            >
              Apply config
            </button>
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
                stopEditingWhenCellsLoseFocus={true}
                onCellValueChanged={handleCellValueChanged}
              ></AgGridReact>
            </div>

            {selectedDeviceToDelete && (
              <Modal
                show={selectedDeviceToDelete}
                onClose={handleDeleteCancellation}
              >
                <div>
                  <p className="mb-10">
                    Device {selectedDeviceToDelete}, its components and links
                    will be removed
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

      {/* <div className="listContainer">
        <div className="listTitle">
          Available Devices
          <div>
            <button
              className="btnStyle "
              onClick={discoverDhcp}
              disabled={!getIsStaff()}
            >
              Discover DHCP
            </button>
          </div>
        </div>

        <div className="resizable">
          <div className="datatable" id="">
            <div style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                rowData={dhcpTable}
                columnDefs={dhcpColumn}
                defaultColDef={defaultColDef}
                domLayout={"autoHeight"}
                enableCellTextSelection="true"
                // onCellClicked={onCellClicked}
                stopEditingWhenCellsLoseFocus={true}
                // onCellValueChanged={handleCellValueChanged}
                onSelectionChanged={onSelectionChanged}
                rowSelection="multiple"
                suppressRowClickSelection={true}
              ></AgGridReact>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default Home;
