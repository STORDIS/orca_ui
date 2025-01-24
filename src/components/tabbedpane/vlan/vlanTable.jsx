import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { vlanColumns, defaultColDef } from "../datatablesourse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getVlansURL, removeVlanIp } from "../../../utils/backend_rest_urls";
import Modal from "../../modal/Modal";
import VlanForm from "./VlanForm";
import VlanMemberForm from "./vlanMemberForm";
import VlanSagIpForm from "./vlanSagIpForm";
import VlanIpForm from "./vlanIpForm";
import interceptor from "../../../utils/interceptor";
import { getIsStaff } from "../../../utils/common";
import useStoreConfig from "../../../utils/configStore";
import useStoreLogs from "../../../utils/store";
import { isValidIPv4WithCIDR } from "../../../utils/common";

import { syncFeatureCommon } from "../Deviceinfo";
import secureLocalStorage from "react-secure-storage";

// Function to get vlan names
export const getVlanDataCommon = (selectedDeviceIp) => {
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
      console.error(err);
      return []; // Return an empty array on error
    });
};

const VlanTable = (props) => {
  const instance = interceptor();
  const theme = useMemo(() => {
    if (secureLocalStorage.getItem("theme") === "dark") {
      return "ag-theme-alpine-dark";
    } else {
      return "ag-theme-alpine";
    }
  }, []);

  const gridRef = useRef();
  const [dataTable, setDataTable] = useState([]);

  const [configStatus, setConfigStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [changes, setChanges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState("null");
  const [modalContent, setModalContent] = useState("");
  const selectedDeviceIp = props.selectedDeviceIp;
  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

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
    getVlanDataCommon(selectedDeviceIp).then((res) => {
      setDataTable(res);
    });
  };

  const deleteVlan = () => {
    setUpdateConfig(true);
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
              !selectedRows.some((selectedRow) => selectedRow.name === row.name)
          );
          setDataTable(updatedDataTable);
        }
        setSelectedRows([]);
      })
      .catch((err) => {})
      .finally(() => {
        setUpdateLog(true);
        setUpdateConfig(false);
        reload();
      });
  };

  const handleFormSubmit = (formData) => {
    putConfig(formData);
  };

  const putConfig = (formData) => {
    setUpdateConfig(true);
    setConfigStatus("Config In Progress....");

    const apiMUrl = getVlansURL(selectedDeviceIp);
    instance
      .put(apiMUrl, formData)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setUpdateLog(true);
        setUpdateConfig(false);
        reload();
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

  const reload = () => {
    getVlans();
    setChanges([]);
    setSelectedRows([]);
    setIsModalOpen("null");
    setConfigStatus("");
    getVlans();
  };

  const openAddFormModal = () => {
    setIsModalOpen("addVlan");
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const handleCellValueChanged = useCallback((params) => {
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
          prev[existedIndex][params.colDef.field] = params.newValue || "";
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

    if (
      params?.colDef?.field === "ip_address" &&
      (params.data.sag_ip_address === "" || params.data.sag_ip_address === null)
    ) {
      setIsModalOpen("vlanIpForm");
    }

    setSelectedRows(params.data);
  }, []);

  const gridStyle = useMemo(
    () => ({
      height: props.height - 75 + "px",
      width: "100%",
    }),
    [props.height]
  );

  const resyncVlan = async () => {
    let payload = {
      mgt_ip: selectedDeviceIp,
      feature: "vlan",
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
    <div className="datatable-container">
      <div className="datatable">
        <div className="button-group mt-5 mb-5 ">
          <div>
            <button
              className="btnStyle m-10"
              onClick={resyncVlan}
              disabled={updateConfig}
            >
              Rediscover
            </button>

            <button
              disabled={updateConfig || changes.length === 0}
              className="btnStyle m-10"
              onClick={() => handleFormSubmit(changes)}
            >
              Apply Config
            </button>
            <span className="configStatus">{configStatus}</span>
          </div>
          <div>
            <button
              className="btnStyle m-10"
              disabled={!getIsStaff()}
              onClick={openAddFormModal}
            >
              Add Vlan
            </button>
            <button
              className="btnStyle m-10"
              onClick={handleDelete}
              disabled={
                selectedRows.length === 0 || selectedRows.length === undefined
              }
            >
              Delete selected Vlan
            </button>
          </div>
        </div>

        <div style={gridStyle} className={theme}>
          <AgGridReact
            ref={gridRef}
            rowData={dataTable}
            columnDefs={vlanColumns}
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

        {/* model for editing sag ip */}
        {isModalOpen === "vlanIpForm" && (
          <Modal
            show={true}
            onClose={reload}
            title={"Edit Ip"}
            onSubmit={(e) => handleFormSubmit(e)}
          >
            <VlanIpForm
              selectedDeviceIp={selectedDeviceIp}
              inputData={selectedRows}
            />
          </Modal>
        )}

        {/* model for editing sag ip */}
        {isModalOpen === "vlanSagIpForm" && (
          <Modal
            show={true}
            onClose={reload}
            title={"Edit Sag Ip"}
            onSubmit={(e) => handleFormSubmit(e)}
          >
            <VlanSagIpForm
              selectedDeviceIp={selectedDeviceIp}
              inputData={selectedRows}
            />
          </Modal>
        )}

        {/* model for adding vlan */}
        {isModalOpen === "addVlan" && (
          <Modal
            show={true}
            onClose={reload}
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
            onClose={reload}
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
                <button className="btnStyle" onClick={deleteVlan}>
                  Yes
                </button>
                <button className="btnStyle" onClick={reload}>
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
