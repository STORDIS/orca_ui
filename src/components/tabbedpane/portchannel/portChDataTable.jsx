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
import PortChannelIpForm from "./PortChannelIpForm";
import useStoreLogs from "../../../utils/store";

import { getIsStaff } from "../../../utils/common";
import useStoreConfig from "../../../utils/configStore";


import { syncFeatureCommon } from "../Deviceinfo";
import secureLocalStorage from "react-secure-storage";

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
      console.error(err);
      return [];
    });
};

const PortChDataTable = (props) => {
  const gridRef = useRef();
  const theme = useMemo(() => {
    if (secureLocalStorage.getItem("theme") === "dark") {
      return "ag-theme-alpine-dark";
    } else {
      return "ag-theme-alpine";
    }
  }, []);

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
                (selectedRow) => selectedRow.lag_name === row.lag_name
              )
          );
          setDataTable(updatedDataTable);
        }
        setSelectedRows([]);
      })
      .catch((err) => {})
      .finally(() => {
        reload();
        setUpdateConfig(false);
        setUpdateLog(true);
      });
  };

  const reload = () => {
    setConfigStatus("");
    setChanges([]);
    setDataTable([]);
    getAllPortChanalData();
    setIsModalOpen("null");
    setSelectedRows([]);
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const handleCellValueChanged = useCallback((params) => {
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
          prev[existedIndex][params.colDef.field] = params.newValue;
          latestChanges = [...prev];
        } else {
          latestChanges = [
            ...prev,
            {
              mgt_ip: selectedDeviceIp,
              lag_name: params.data.lag_name,
              [params.colDef.field]: params.newValue,
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
    if (params?.colDef?.field === "ip_address") {
      setIsModalOpen("portChannelIpForm");
    }
    setSelectedRows(params.data);
  }, []);

  const handleFormSubmit = (formData) => {
    setUpdateConfig(true);
    setConfigStatus("Config In Progress....");
    const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
    instance
      .put(apiPUrl, formData)
      .then((res) => {
        reload();
      })
      .catch((err) => {
        reload();
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
    setModalContent("Do you want to delete Portchannel with id " + nameArray);
  };

  const gridStyle = useMemo(
    () => ({
      height: props.height - 75 + "px",
      width: "100%",
    }),
    [props.height]
  );

  const resyncPortchannel = async () => {
    let payload = {
      mgt_ip: selectedDeviceIp,
      feature: "port_channel",
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
    <div className="datatable-container" id="portChannelDataTable">
      <div className="datatable">
        <div className="button-group mt-5 mb-5">
          <div>
            <button
              className="btnStyle m-10"
              onClick={resyncPortchannel}
              disabled={updateConfig}
            >
              Rediscover
            </button>

            <button
              onClick={() => handleFormSubmit(changes)}
              disabled={updateConfig || Object.keys(changes).length === 0}
              className="btnStyle m-10"
              id="applyConfigBtn"
            >
              Apply Config
            </button>
            <span className="configStatus" id="configStatus">
              {configStatus}
            </span>
          </div>

          <div>
            <button
              className="btnStyle m-10"
              disabled={!getIsStaff()}
              onClick={openAddFormModal}
              id="addPortchannelBtn"
            >
              Add Port Channel
            </button>
            <button
              className="btnStyle m-10"
              onClick={handleDelete}
              disabled={
                selectedRows.length === 0 || selectedRows.length === undefined
              }
              id="deletePortChannelBtn"
            >
              Delete Selected Port Channel
            </button>
          </div>
        </div>

        <div style={gridStyle} className={theme}>
          <AgGridReact
            ref={gridRef}
            rowData={dataTable}
            columnDefs={portChannelColumns}
            defaultColDef={defaultColDef}
            stopEditingWhenCellsLoseFocus={true}
            onCellValueChanged={handleCellValueChanged}
            enableCellTextSelection="true"
            onSelectionChanged={onSelectionChanged}
            onCellClicked={onCellClicked}
            rowSelection="multiple"
            suppressRowClickSelection={true}
          ></AgGridReact>
        </div>

        {/* add port channel */}
        {isModalOpen === "portChannelIpForm" && (
          <Modal
            show={true}
            onClose={reload}
            title={"Add Port Channel"}
            onSubmit={handleFormSubmit}
            id="portChannelIpForm"
          >
            <PortChannelIpForm
              selectedDeviceIp={selectedDeviceIp}
              inputData={selectedRows}
            />
          </Modal>
        )}
        {/* add port channel */}
        {isModalOpen === "addPortchannel" && (
          <Modal
            show={true}
            onClose={reload}
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
            onClose={reload}
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
            onClose={reload}
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
          <Modal show={true} onClose={reload}>
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
                <button className="btnStyle" onClick={reload} id="removeNoBtn">
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
