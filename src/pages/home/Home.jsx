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
import CredentialForm from "../ZTPnDHCP/CredentialsForm";

import interceptor from "../../utils/interceptor.js";

import {
  deleteDevicesURL,
  getDiscoveryUrl,
} from "../../utils/backend_rest_urls.js";
import useStoreConfig from "../../utils/configStore.js";
import useStoreLogs from "../../utils/store.js";
import "./home.scss";

import { getIsStaff } from "../../utils/common";
import { ZTPnDHCP } from "../ZTPnDHCP/ztpndhcp";

export const Home = () => {
  const instance = interceptor();

  const deviceTableRef = useRef(null);
  const dhcpTableRef = useRef(null);

  const gridRefDhcpTable = useRef();

  const [dataTable, setDataTable] = useState([]);
  const [selectedDeviceToDelete, setSelectedDeviceToDelete] = useState("");
  const [selectedDeviceToUpdate, setSelectedDeviceToUpdate] = useState([]);

  const [dhcpTable, setDhcpTable] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);

  const updateLog = useStoreLogs((state) => state.updateLog);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  const [heightDeviceTable, setHeightDeviceTable] = useState(250);
  const [heightDhcpTable, setHeightDhcpTable] = useState(250);

  const [isSSHConnected, setIsSSHConnected] = useState(false);

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    if (updateLog) {
      getDevices();
    }
  }, [updateLog]);

  const getDhcpDevices = (e) => {
    setDhcpTable([]);
    if (e) {
      instance(dhcpDeviceListURL())
        .then((res) => {
          setDhcpTable(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setDhcpTable([]);
    }
  };

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

  const onSelectionChanged = () => {
    const selectedNodes = gridRefDhcpTable.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data.device_ip);
    setSelectedRows(selectedData);
  };

  const discoverDhcp = async () => {
    try {
      const response = await instance.put(getDiscoveryUrl(), {
        address: selectedRows,
        discover_from_config: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateLog(true);
      setUpdateConfig(false);
    }
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

  const handleResizeDhcpTable = () => {
    if (dhcpTableRef.current.offsetHeight > 250) {
      setHeightDhcpTable(dhcpTableRef.current.offsetHeight);
    }
  };

  const gridStyleDhcpTable = useMemo(
    () => ({ height: heightDhcpTable + "px", width: "100%" }),
    [heightDhcpTable]
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

      <div className="listContainer">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="listTitle">Available SONiC Devices in network</span>
          <CredentialForm
            type="status"
            sendCredentialsToParent={(e) => {
              getDhcpDevices(e.ssh_access);
              setIsSSHConnected(e.ssh_access);
            }}
          />
          <div>
            <button
              className="btnStyle "
              onClick={discoverDhcp}
              disabled={!getIsStaff() || selectedRows.length === 0}
            >
              Discover Device
            </button>
            <button
              className="btnStyle ml-15"
              onClick={() => {
                getDhcpDevices(isSSHConnected);
              }}
              disabled={!getIsStaff()}
            >
              Refresh
            </button>
          </div>
        </div>

        <div
          className="datatable resizable mt-15"
          ref={dhcpTableRef}
          onMouseMove={handleResizeDhcpTable}
        >
          <div style={gridStyleDhcpTable} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRefDhcpTable}
              rowData={dhcpTable}
              columnDefs={dhcpColumn}
              defaultColDef={defaultColDef}
              // enableCellTextSelection="true"
              // onCellClicked={onCellClicked}
              stopEditingWhenCellsLoseFocus={true}
              onSelectionChanged={onSelectionChanged}
              rowSelection="multiple"
              suppressRowClickSelection={true}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
