import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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

import { syncFeatureCommon } from "../Deviceinfo";

const BGPTable = (props) => {
  const instance = interceptor();

  const gridRef = useRef();
  const selectedDeviceIp = props.selectedDeviceIp;

  const [dataTable, setDataTable] = useState([]);
  const [configStatus, setConfigStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [changes, setChanges] = useState({});

  const [isModalOpen, setIsModalOpen] = useState("");
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
        res?.data?.forEach((element) => {
          element.neighbor_prop = JSON.stringify(element?.neighbor_prop);
        });
        setDataTable(res.data);
      })
      .catch((err) => {});
  };

  // create / update
  const openAddModal = () => {
    setIsModalOpen("addBGP");
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

  const handleFormSubmit = (formData) => {
    setUpdateConfig(true);
    setConfigStatus("Config In Progress....");
    const apiPUrl = getAllBGPOfDeviceURL(selectedDeviceIp);
    instance
      .put(apiPUrl, formData)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setUpdateLog(true);
        setUpdateConfig(false);
        reload();
        setChanges({});
      });
  };

  // delete
  const handleDelete = () => {
    setIsModalOpen("deleteBGP");
    setModalContent("Do you want to delete BGP");
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
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setUpdateLog(true);
        setUpdateConfig(false);
        reload();
      });
  };

  const reload = () => {
    getBgp();
    setConfigStatus("");
    setIsModalOpen("");
    setSelectedRows([]);
  };

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

  const gridStyle = useMemo(
    () => ({
      height: props.height - 75 + "px",
      width: "100%",
    }),
    [props.height]
  );

  return (
    <div className="datatable">
      <div className="button-group mt-5 mb-5">
        <div>
          <button
            className="btnStyle m-10"
            onClick={resyncBgp}
            disabled={updateConfig}
          >
            Rediscover
          </button>

          <button
            disabled={updateConfig || Object.keys(changes).length === 0}
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
            onClick={openAddModal}
          >
            Add BGP
          </button>

          <button
            className="btnStyle m-10"
            disabled={selectedRows.length === 0}
            onClick={handleDelete}
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

      {isModalOpen === "addBGP" && (
        <Modal
          show={true}
          onClose={() => reload()}
          title={"Add BGP"}
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <BgpForm selectedDeviceIp={selectedDeviceIp} />
        </Modal>
      )}

      {/* model for delete confirmation message */}
      {isModalOpen === "deleteBGP" && (
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
              <button className="btnStyle" onClick={deleteBgp}>
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
  );
};

export default BGPTable;
