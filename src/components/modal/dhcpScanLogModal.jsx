import React, { useEffect, useState } from "react";
import "./logModel.scss";

import { celeryURL, getDiscoveryUrl } from "../../utils/backend_rest_urls";
import useStoreConfig from "../../utils/configStore";
import useStoreLogs from "../../utils/store";
import interceptor from "../../utils/interceptor";
import { FaSquareXmark } from "react-icons/fa6";
import CommonLogTable from "./commonLogTable";
import useStorePointer from "../../utils/pointerStore";

const DhcpScanLogModal = ({ logData, onClose, onSubmit, title, id }) => {
  const [sonicDevices, setSonicDevices] = useState({});
  const [selectedDevicesSonic, setSelectedDevicesSonic] = useState([]);
  const [selectAllSonic, setSelectAllSonic] = useState(false);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  const setUpdateStorePointer = useStorePointer(
    (state) => state.setUpdateStorePointer
  );

  const instance = interceptor();

  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (Object.keys(logData?.response).includes("sonic_devices")) {
      setSonicDevices(logData?.response?.sonic_devices);
      setShowResponse(false);
    } else {
      setShowResponse(true);
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // sonic function
  const handelCheckedSonic = (event, ip) => {
    console.log(ip);
    setSelectedDevicesSonic((prevSelectedNetworkDevices) => {
      if (event.target.checked) {
        return [...prevSelectedNetworkDevices, ip];
      } else {
        return prevSelectedNetworkDevices.filter((item) => item !== ip);
      }
    });
  };

  const selectAllIpSonic = (e) => {
    if (e.target.checked) {
      const result = [];
      sonicDevices.forEach((entry) => {
        result.push(entry.mgt_ip);
      });
      setSelectedDevicesSonic(result);
      setSelectAllSonic(true);
    } else {
      setSelectedDevicesSonic([]);
      setSelectAllSonic(false);
    }
  };

  const applyConfig = async () => {
    // console.log(selectedDevicesSonic);
    try {
      const response = await instance.put(getDiscoveryUrl(), {
        address: selectedDevicesSonic,
        discover_from_config: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateLog(true);
      setUpdateConfig(false);
      onClose();
    }
  };

  const revoke = () => {
    let payload = {
      task_id: logData?.task_id,
    };

    setUpdateConfig(true);
    const apiMUrl = celeryURL();
    instance
      .delete(apiMUrl, { data: payload })
      .then((response) => {})
      .catch((err) => {})
      .finally(() => {
        setUpdateLog(true);
        setUpdateConfig(false);
        onSubmit();
        setUpdateStorePointer();
      });
  };

  return (
    <div className="modalContainer" onClick={onClose} id={id}>
      <div className="modalInner" onClick={(e) => e.stopPropagation()}>
        <h4 className="modalHeader">
          <span className="listTitle">{title}</span>

          <FaSquareXmark className="closeBtn danger" onClick={onClose} />
        </h4>

        <div className="modalBody mt-10 mb-10">
          <CommonLogTable
            logData={logData}
            showResponse={showResponse}
          ></CommonLogTable>

          {/* discovery responce table */}
          {Object.keys(sonicDevices).length > 0 && (
            <div className="mt-10" id="sonicDevices">
              <div className="mt-10 mb-10">
                <b>Response :</b>
              </div>
              <div className="listTitle">
                Following SONiC devices identified from the respective networks
                provided for Discovery
              </div>

              <div className="" style={{ overflowX: "auto" }}>
                <table id="sonicDevicesTable">
                  <thead>
                    <tr>
                      <th>IP Address</th>
                      <th id="selectAll">
                        Discover
                        <input
                          className="ml-10"
                          type="checkbox"
                          onChange={(e) => {
                            selectAllIpSonic(e);
                          }}
                        />
                      </th>
                      <th>Image Name</th>
                      <th>Management Intf</th>
                      <th>HWSKU </th>
                      <th>MAC </th>
                      <th>Platform </th>
                      <th>Type </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sonicDevices.map((entry, index) => (
                      <tr
                        key={index}
                        id={index}
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <td>{entry.mgt_ip}</td>
                        <td>
                          <input
                            type="checkbox"
                            id="selectDevice"
                            disabled={selectAllSonic}
                            checked={
                              selectedDevicesSonic.filter(
                                (item) => item === entry.mgt_ip
                              ).length > 0
                            }
                            onChange={(e) => {
                              handelCheckedSonic(e, entry.mgt_ip);
                            }}
                          />
                        </td>

                        <td>{entry["img_name"]}</td>
                        <td>{entry["mgt_intf"]}</td>
                        <td>{entry["hwsku"]}</td>
                        <td>{entry["mac"]}</td>
                        <td>{entry["platform"]}</td>
                        <td>{entry["type"]}</td>
                      </tr>
                    ))}

                    {sonicDevices.length === 0 ? (
                      <tr>
                        <td colSpan="18">
                          <span className="ml-25">
                            No network devices found
                          </span>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="modalFooter">
          {sonicDevices.length > 0 && (
            <div>
              <button
                className="btnStyle mr-15"
                onClick={applyConfig}
                disabled={selectedDevicesSonic.length === 0}
                id="applyConfigBtn"
              >
                Discover Network
              </button>
            </div>
          )}

          {logData?.status.toUpperCase() === "STARTED" ||
          logData?.status.toUpperCase() === "PENDING" ? (
            <div>
              <button
                onClick={revoke}
                className="btnStyle mr-15"
                id="revokeTaskBtn"
              >
                revoke running task
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DhcpScanLogModal;
