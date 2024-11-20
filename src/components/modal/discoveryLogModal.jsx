import React, { useEffect, useState } from "react";
import "./logModel.scss";

import {
  celeryURL,
  installSonicURL,
  celeryTaskURL,
} from "../../utils/backend_rest_urls";
import useStoreConfig from "../../utils/configStore";
import useStoreLogs from "../../utils/store";
import interceptor from "../../utils/interceptor";
import { isValidIPv4WithCIDR } from "../../utils/common";
import { FaSquareXmark } from "react-icons/fa6";
import CommonLogTable from "./commonLogTable";

const DiscoveryLogModal = ({ logData, onClose, onSubmit, title, id }) => {
  const [sonicDevices, setSonicDevices] = useState({
    "10.10.229.123/28": [
      {
        img_name: "SONiC-OS-4.4.0-Enterprise_Base",
        mgt_intf: "Management0",
        mgt_ip: "10.10.229.114/21",
        hwsku: "DellEMC-S5248f-P-25G-DPB",
        mac: "0c:70:d3:24:00:0a",
        platform: "x86_64-kvm_x86_64-r0",
        type: "LeafRouter",
      },
      {
        img_name: "SONiC-OS-4.1.4-Enterprise_Base",
        mgt_intf: "Management0",
        mgt_ip: "10.10.229.118/21",
        hwsku: "DellEMC-S5248f-P-25G-DPB",
        mac: "0c:33:fb:e0:00:0a",
        platform: "x86_64-kvm_x86_64-r0",
        type: "LeafRouter",
      },
      {
        img_name: "SONiC-OS-4.4.0-Enterprise_Base",
        mgt_intf: "Management0",
        mgt_ip: "10.10.229.120/21",
        hwsku: "DellEMC-S5248f-P-25G-DPB",
        mac: "0c:29:e5:ca:00:0a",
        platform: "x86_64-kvm_x86_64-r0",
        type: "LeafRouter",
      },
      {
        img_name: "SONiC-OS-4.2.2-Enterprise_Base",
        mgt_intf: "Management0",
        mgt_ip: "10.10.229.124/21",
        hwsku: "DellEMC-S5248f-P-25G-DPB",
        mac: "0c:17:33:aa:00:0a",
        platform: "x86_64-kvm_x86_64-r0",
        type: "LeafRouter",
      },
    ],
  });
  const [selectedDevicesSonic, setSelectedDevicesSonic] = useState([]);
  const [selectAllSonic, setSelectAllSonic] = useState(false);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  const instance = interceptor();

  useEffect(() => {
    console.log(logData);

    if (Object.keys(logData?.response).includes("sonic_devices")) {
      // setSonicDevices(logData?.response?.sonic_devices);
    } else {
      console.log("sonic devices not found");
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
    setSelectedDevicesSonic((prevSelectedNetworkDevices) => {
      if (event.target.checked) {
        return [
          ...prevSelectedNetworkDevices,
          {
            device_ips: [ip],
            discover_from_config: false,
          },
        ];
      } else {
        return prevSelectedNetworkDevices.filter(
          (item) => item.device_ips[0] !== ip
        );
      }
    });
  };

  const selectAllIpSonic = (e) => {
    if (e.target.checked) {
      const result = [];
      Object.keys(sonicDevices).forEach((network) => {
        sonicDevices[network].forEach((entry) => {
          result.push({
            device_ips: [entry.mgt_ip],
            discover_from_config: false,
          });
        });
      });
      setSelectedDevicesSonic(result);
      setSelectAllSonic(true);
    } else {
      setSelectedDevicesSonic([]);
      setSelectAllSonic(false);
    }
  };

  const applyConfig = async () => {
    console.log(selectedDevicesSonic);
    // try {
    //     const response = await instance.put(installSonicURL(), selectedDevicesSonic);
    // } catch (error) {
    //     console.log(error);
    // } finally {
    //     setUpdateLog(true);
    //     setUpdateConfig(false);
    //     onClose();
    // }
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
      });
  };

  return (
    <div className="modalContainer" onClick={onClose} id={id}>
      <div className="modalInner" onClick={(e) => e.stopPropagation()}>
        <h4 className="modalHeader">
          {title} - discoveryLogModal
          <FaSquareXmark
            style={{ fontSize: "30px", cursor: "pointer" }}
            onClick={onClose}
          />
        </h4>

        <div className="modalBody mt-10 mb-10">
          <CommonLogTable
            logData={logData}
            showResponse={false}
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
                      <th>Network Address</th>
                      <th>IP Address</th>
                      <th id="selectAll">
                        Select All
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
                    {Object.keys(sonicDevices).map((key) => (
                      <React.Fragment key={key}>
                        {sonicDevices[key].map((entry, index) => (
                          <tr
                            key={index}
                            id={index}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {index === 0 ? (
                              <td
                                rowSpan={sonicDevices[key].length}
                                id="deviceNameFromNetwork"
                              >
                                {key}
                              </td>
                            ) : null}

                            <td>{entry.mgt_ip}</td>

                            <td>
                              <input
                                type="checkbox"
                                id="selectDevice"
                                disabled={selectAllSonic}
                                checked={
                                  selectedDevicesSonic.filter(
                                    (item) =>
                                      item.device_ips[0] === entry.mgt_ip
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
                      </React.Fragment>
                    ))}

                    {Object.values(sonicDevices)[0].length === 0 ? (
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
          {Object.keys(sonicDevices).length > 0 && (
            <div>
              <button
                className="btnStyle ml-15"
                onClick={applyConfig}
                disabled={selectedDevicesSonic.length === 0}
                id="applyConfigBtn"
              >
                Apply Config
              </button>
            </div>
          )}

          {logData?.status.toUpperCase() === "STARTED" ||
          logData?.status.toUpperCase() === "PENDING" ? (
            <div>
              <button
                onClick={revoke}
                className="btnStyle ml-15"
                id="revokeTaskBtn"
              >
                revoke running task
              </button>
            </div>
          ) : null}

          {/* <div>
            <button
              className="btnStyle ml-15"
              id="DiscoveryLogModalCloseBtn"
              onClick={onClose}
            >
              Close
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryLogModal;
