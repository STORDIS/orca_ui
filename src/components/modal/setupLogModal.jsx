import React, { useEffect, useState } from "react";
import "./logModel.scss";

import { celeryURL, installSonicURL } from "../../utils/backend_rest_urls";
import useStoreConfig from "../../utils/configStore";
import useStoreLogs from "../../utils/store";
import interceptor from "../../utils/interceptor";
import { isValidIPv4WithCIDR } from "../../utils/common";
import { FaSquareXmark } from "react-icons/fa6";
import CommonLogTable from "./commonLogTable";
import useStorePointer from "../../utils/pointerStore";

const SetupLogModal = ({ logData, onClose, onSubmit, title, id }) => {
  const [installResponses, setInstallResponses] = useState([]);

  const [onieDevices, setOnieDevices] = useState([]);
  const [selectedDevicesOnie, setSelectedDevicesOnie] = useState([]);
  const [sonicDevices, setSonicDevices] = useState([]);
  const [selectedDevicesSonicInstall, setSelectedDevicesSonicInstall] =
    useState([]);
  const [selectedDevicesSonicDiscover, setSelectedDevicesSonicDiscover] =
    useState([]);

  const [selectAllOnie, setSelectAllOnie] = useState(false);
  const [selectAllSonicInstall, setSelectAllSonicInstall] = useState(false);
  const [selectAllSonicDiscover, setSelectAllSonicDiscover] = useState(false);
  const [ShowResponse, setShowResponse] = useState(false);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  const instance = interceptor();

  const setUpdateStorePointer = useStorePointer(
    (state) => state.setUpdateStorePointer
  );


  useEffect(() => {
    if (Object.keys(logData?.response).includes("onie_devices")) {
      setOnieDevices(logData?.response?.onie_devices);
    } else {
    }
    if (Object.keys(logData?.response).includes("sonic_devices")) {
      setSonicDevices(logData?.response?.sonic_devices);
    } else {
      let is_ip = false;
      Object.keys(logData?.response).forEach((element) => {
        if (isValidIPv4WithCIDR(element)) {
          is_ip = true;
        }
      });

      if (is_ip) {
        setInstallResponses(logData?.response);
      } else {
        setInstallResponses([]);
        setShowResponse(true);
      }
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

  // onie function
  const handelCheckedOnie = (event, ip) => {
    setSelectedDevicesOnie((prevSelectedNetworkDevices) => {
      if (event.target.checked) {
        return [
          ...prevSelectedNetworkDevices,
          {
            image_url: logData?.request_json?.image_url,
            device_ips: [ip],
            discover_also: false,
            username: logData?.request_json?.username,
            password: logData?.request_json?.password,
          },
        ];
      } else {
        return prevSelectedNetworkDevices.filter(
          (item) => item.device_ips[0] !== ip
        );
      }
    });
  };

  const handelDiscoveryCheckedOnie = (e, ip) => {
    selectedDevicesOnie.forEach((item) => {
      if (item.device_ips[0] === ip) {
        item.discover_also = e.target.checked;
      }
    });
    setSelectedDevicesOnie([...selectedDevicesOnie]);
  };

  const discoverDisabledOnie = (e) => {
    let result = selectedDevicesOnie.some((item) =>
      item.device_ips.includes(e)
    );
    return !result;
  };

  const selectAllIpOnie = (e) => {
    if (e.target.checked) {
      const result = [];
      Object.keys(onieDevices).forEach((network) => {
        onieDevices[network].forEach((entry) => {
          result.push({
            image_url: logData?.request_json?.image_url,
            device_ips: [entry.mgt_ip],
            discover_also: false,
            username: logData?.request_json?.username,
            password: logData?.request_json?.password,
          });
        });
      });
      setSelectedDevicesOnie(result);
      setSelectAllOnie(true);
    } else {
      setSelectedDevicesOnie([]);
      setSelectAllOnie(false);
    }
  };

  const selectDiscoverAllOnie = (e) => {
    setSelectedDevicesOnie(
      selectedDevicesOnie.map((item) => {
        return {
          ...item,
          discover_also: e.target.checked,
        };
      })
    );
  };

  // sonic function
  const handelCheckedSonic = (event, ip) => {
    setSelectedDevicesSonicInstall((prevSelectedNetworkDevices) => {
      if (event.target.checked) {
        return [
          ...prevSelectedNetworkDevices,
          {
            image_url: logData?.request_json?.image_url,
            device_ips: [ip],
            discover_also: false,
            install_also: true,
            username: logData?.request_json?.username,
            password: logData?.request_json?.password,
          },
        ];
      } else {
        return prevSelectedNetworkDevices.filter(
          (item) => item.device_ips[0] !== ip
        );
      }
    });
  };

  const handelDiscoveryCheckedSonic = (event, ip) => {
    setSelectedDevicesSonicDiscover((prevSelectedNetworkDevices) => {
      if (event.target.checked) {
        return [
          ...prevSelectedNetworkDevices,
          {
            device_ips: [ip],
            discover_also: true,
            install_also: false,
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
            image_url: logData?.request_json?.image_url,
            device_ips: [entry.mgt_ip],
            discover_also: false,
            install_also: true,
            username: logData?.request_json?.username,
            password: logData?.request_json?.password,
          });
        });
      });
      setSelectedDevicesSonicInstall(result);
      setSelectAllSonicInstall(true);
    } else {
      setSelectedDevicesSonicInstall([]);
      setSelectAllSonicInstall(false);
    }
  };

  const selectDiscoverAllSonic = (e) => {
    if (e.target.checked) {
      const result = [];
      Object.keys(sonicDevices).forEach((network) => {
        sonicDevices[network].forEach((entry) => {
          result.push({
            device_ips: [entry.mgt_ip],
            discover_also: true,
            install_also: false,
          });
        });
      });
      setSelectedDevicesSonicDiscover(result);
      setSelectAllSonicDiscover(true);
    } else {
      setSelectedDevicesSonicDiscover([]);
      setSelectAllSonicDiscover(false);
    }
  };

  // extra functions
  const applyConfig = async () => {
    const mapArr1 = new Map(
      selectedDevicesSonicInstall.map((item) => [item.device_ips[0], item])
    );

    const unmatched = [];

    selectedDevicesSonicDiscover.forEach((item) => {
      const ip = item.device_ips[0];
      if (mapArr1.has(ip)) {
        const matchedItem = mapArr1.get(ip);
        if (!matchedItem.discover_also && item.discover_also) {
          matchedItem.discover_also = true;
        }
      } else {
        unmatched.push(item);
      }
    });

    let allIpis = [
      ...selectedDevicesOnie,
      ...selectedDevicesSonicInstall,
      ...unmatched,
    ];
    try {
      const response = await instance.put(installSonicURL(), allIpis);
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

  const formattedRequestJson = logData?.request_json
    ? Object.entries(logData?.request_json)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    : "waiting for process to complete";

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const isTextOverflow = (text) => {
    const maxLineLength = 80;
    const maxLines = 5;
    return text.length > maxLineLength * maxLines;
  };

  return (
    <div className="modalContainer" onClick={onClose} id={id}>
      <div className="modalInner" onClick={(e) => e.stopPropagation()}>
        <h4 className="modalHeader">
          {title}
          <FaSquareXmark className="closeBtn danger" onClick={onClose} />
        </h4>

        <div className="modalBody mt-10 mb-10">
          {/* common table */}

          <CommonLogTable
            logData={logData}
            showResponse={ShowResponse}
          ></CommonLogTable>

          {/* install response table */}
          {Object.keys(installResponses).length > 0 && (
            <div id="installResponse">
              <div className="mt-10 mb-10">
                <b>Response :</b>
              </div>

              <table
                border="1"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
                id="networkListTable"
              >
                <thead>
                  <tr>
                    <th className="w-40">IP Address</th>
                    <th className="w-60">response</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(installResponses).map((key) => (
                    <tr key={key}>
                      <td className="w-40">{key}</td>

                      {installResponses[key].output ? (
                        <td className="w-60">
                          <span
                            className={isExpanded ? "expanded" : "textOverflow"}
                          >
                            {installResponses[key].output}
                          </span>

                          <div
                            style={{
                              textAlign: "end",
                            }}
                          >
                            {isTextOverflow(installResponses[key].output) && (
                              <div
                                style={{
                                  textAlign: "end",
                                }}
                              >
                                <button
                                  className="btnStyle mt-10"
                                  onClick={handleToggle}
                                >
                                  {isExpanded ? "Collapse" : "Expand"}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      ) : (
                        <td className="w-60">
                          <span className="danger textOverflow">
                            {installResponses[key].error}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* onie devices table */}
          {Object.keys(onieDevices).length > 0 && (
            <div className="mt-10" id="onieDevices">
              <div className="mt-10 mb-10">
                <b>Response :</b>
              </div>

              <div className="listTitle">
                Following ONIE devices identified from the repective networks
                provided for SONiC installation
              </div>

              <div className="" style={{ overflowX: "auto" }}>
                <table id="onieDevicesTable">
                  <thead>
                    <tr>
                      <th>Network Address</th>
                      <th>IP Address</th>
                      <th id="">
                        Install on All
                        <input
                          className="ml-10"
                          type="checkbox"
                          onChange={(e) => {
                            selectAllIpOnie(e);
                          }}
                        />
                      </th>
                      <th id="discoverAll">
                        Discover All
                        <input
                          className="ml-10"
                          type="checkbox"
                          disabled={!selectAllOnie}
                          onChange={(e) => {
                            selectDiscoverAllOnie(e);
                          }}
                        />
                      </th>
                      <th>Manufacture Date</th>
                      <th>Label Revision</th>
                      <th>Platform Name </th>
                      <th>ONIE Version </th>
                      <th>Manufacturer </th>
                      <th>Country Code </th>
                      <th>Diag Version </th>
                      <th>Base MAC Address </th>
                      <th>Serial Number </th>
                      <th>Part Number </th>
                      <th>Product Name </th>
                      <th>MAC Addresses </th>
                      <th>Vendor Name </th>
                      <th>CRC-32 </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(onieDevices).map((key) => (
                      <React.Fragment key={key}>
                        {onieDevices[key].map((entry, index) => (
                          <tr
                            key={index}
                            id={index}
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {index === 0 ? (
                              <td
                                rowSpan={onieDevices[key].length}
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
                                disabled={selectAllOnie}
                                checked={
                                  selectedDevicesOnie.filter(
                                    (item) =>
                                      item.device_ips[0] === entry.mgt_ip
                                  ).length > 0
                                }
                                onChange={(e) => {
                                  handelCheckedOnie(e, entry.mgt_ip);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                id="discoverDevice"
                                disabled={discoverDisabledOnie(entry.mgt_ip)}
                                checked={
                                  selectedDevicesOnie.filter(
                                    (item) =>
                                      item.device_ips[0] === entry.mgt_ip &&
                                      item.discover_also
                                  ).length > 0
                                }
                                onChange={(e) => {
                                  handelDiscoveryCheckedOnie(e, entry.mgt_ip);
                                }}
                              />
                            </td>
                            <td>{entry["Manufacture Date"]}</td>
                            <td>{entry["Label Revision"]}</td>
                            <td>{entry["Platform Name"]}</td>
                            <td>{entry["ONIE Version"]}</td>
                            <td>{entry["Manufacturer"]}</td>
                            <td>{entry["Country Code"]}</td>
                            <td>{entry["Diag Version"]}</td>
                            <td>{entry["Base MAC Address"]}</td>
                            <td>{entry["Serial Number"]}</td>
                            <td>{entry["Part Number"]}</td>
                            <td>{entry["Product Name"]}</td>
                            <td>{entry["MAC Addresses"]}</td>
                            <td>{entry["Vendor Name"]}</td>
                            <td>{entry["CRC-32"]}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}

                    {Object.values(onieDevices)[0].length === 0 ? (
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

          {/* sonic devices table */}
          {Object.keys(sonicDevices).length > 0 && (
            <div className="mt-10" id="sonicDevices">
              <div className="mt-10 mb-10">
                <b>Response :</b>
              </div>
              <div className="listTitle">
                Following SONiC devices identified from the respective networks
                provided for SONiC installation
              </div>

              <div className="" style={{ overflowX: "auto" }}>
                <table id="sonicDevicesTable">
                  <thead>
                    <tr>
                      <th>Network Address</th>
                      <th>IP Address</th>
                      <th id="selectAll">
                        Install on All
                        <input
                          className="ml-10"
                          type="checkbox"
                          onChange={(e) => {
                            selectAllIpSonic(e);
                          }}
                        />
                      </th>
                      <th id="discoverAll">
                        Discover All
                        <input
                          className="ml-10"
                          type="checkbox"
                          onChange={(e) => {
                            selectDiscoverAllSonic(e);
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
                                disabled={selectAllSonicInstall}
                                checked={
                                  selectedDevicesSonicInstall.filter(
                                    (item) =>
                                      item.device_ips[0] === entry.mgt_ip
                                  ).length > 0
                                }
                                onChange={(e) => {
                                  handelCheckedSonic(e, entry.mgt_ip);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                id="discoverDevice"
                                disabled={selectAllSonicDiscover}
                                checked={
                                  selectedDevicesSonicDiscover.filter(
                                    (item) =>
                                      item.device_ips[0] === entry.mgt_ip
                                  ).length > 0
                                }
                                onChange={(e) => {
                                  handelDiscoveryCheckedSonic(e, entry.mgt_ip);
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
          {(Object.keys(onieDevices).length > 0 ||
            Object.keys(sonicDevices).length > 0) && (
            <div>
              <button
                className="btnStyle mr-15"
                onClick={applyConfig}
                disabled={
                  selectedDevicesOnie.length === 0 &&
                  selectedDevicesSonicInstall.length === 0 &&
                  selectedDevicesSonicDiscover.length === 0
                }
                id="applyConfigBtn"
              >
                Apply Config
              </button>
            </div>
          )}

          {logData?.status.toUpperCase() === "STARTED" ||
          logData?.status.toUpperCase() === "PENDING" ? (
            <button
              onClick={revoke}
              className="btnStyle mr-15"
              id="revokeTaskBtn"
            >
              revoke running task
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SetupLogModal;
