import React, { useEffect, useState } from "react";
import "./logModel.scss";
import Time from "react-time-format";

import { celeryURL, installSonicURL } from "../../utils/backend_rest_urls";
import useStoreConfig from "../../utils/configStore";
import useStoreLogs from "../../utils/store";
import interceptor from "../../utils/interceptor";

const SetupLogModal = ({ logData, onClose, onSubmit, title, id }) => {
    const [networkList, setNetworkList] = useState({});
    const [selectedNetworkDevices, setSelectedNetworkDevices] = useState([]);
    const [installResponses, setInstallResponses] = useState([]);

    const [selectAll, setSelectAll] = useState(false);
    const [response, setResponse] = useState("null");

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const instance = interceptor();

    useEffect(() => {
        console.log(logData);
        if (
            logData?.response?.networks &&
            Object.keys(logData?.response?.networks).length > 0
        ) {
            console.log(logData?.response?.networks);
            setNetworkList(logData?.response?.networks);
        } else if (
            logData?.response?.install_responses &&
            Object.keys(logData?.response?.install_responses).length > 0
        ) {
            setInstallResponses(logData?.response?.install_responses);
        } else {
            setResponse(JSON.stringify(logData?.response, null, 2));
        }

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handelNetworkChecked = (event, ip) => {
        setSelectedNetworkDevices((prevSelectedNetworkDevices) => {
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

    const handelNetworkDiscoveryChecked = (e, ip) => {
        selectedNetworkDevices.forEach((item) => {
            if (item.device_ips[0] === ip) {
                item.discover_also = e.target.checked;
            }
        });
        setSelectedNetworkDevices([...selectedNetworkDevices]);
    };

    const discoverDisabled = (e) => {
        let result = selectedNetworkDevices.some((item) =>
            item.device_ips.includes(e)
        );
        return !result;
    };

    const selectAllIp = (e) => {
        if (e.target.checked) {
            const result = [];
            Object.keys(networkList).forEach((network) => {
                networkList[network].forEach((entry) => {
                    result.push({
                        image_url: logData?.request_json?.image_url,
                        device_ips: [entry.ip],
                        discover_also: false,
                        username: logData?.request_json?.username,
                        password: logData?.request_json?.password,
                    });
                });
            });
            setSelectedNetworkDevices(result);
            setSelectAll(true);
        } else {
            setSelectedNetworkDevices([]);
            setSelectAll(false);
        }
    };

    const selectDiscoverAll = (e) => {
        setSelectedNetworkDevices(
            selectedNetworkDevices.map((item) => {
                return {
                    ...item,
                    discover_also: e.target.checked,
                };
            })
        );
    };

    const applyConfig = async () => {
        console.log(selectedNetworkDevices);

        try {
            const response = await instance.put(
                installSonicURL(),
                selectedNetworkDevices
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setUpdateLog(true);
            setUpdateConfig(false);
        }
    };

    const revoke = () => {
        let payload = {
            task_id: logData.task_id,
        };
        console.log(payload);

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

    const formattedRequestJson = logData?.request_json
        ? Object.entries(logData?.request_json)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n") // Double newlines for extra space between pairs
        : "waiting for process to complete";

    const [isExpanded, setIsExpanded] = useState(false);

    // Function to toggle between expanded and collapsed
    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const isTextOverflow = (text) => {
        const maxLineLength = 80; // Approximate max characters per line
        const maxLines = 5;
        return text.length > maxLineLength * maxLines;
    };

    return (
        <div className="modalContainer" onClick={onClose} id={id}>
            <div className="modalInner" onClick={(e) => e.stopPropagation()}>
                <h4 className="modalHeader">
                    {title}

                    <button
                        className="btnStyle"
                        id="setupLogModalCloseBtn"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </h4>

                <div className="modalBody mt-10 mb-10">
                    <table>
                        <tbody>
                            <tr>
                                <td className="w-25">
                                    <b>State :</b>
                                </td>
                                <td className="w-75">
                                    {logData.status.toUpperCase() ===
                                    "SUCCESS" ? (
                                        <span className="success">
                                            {logData.status.toUpperCase()}
                                        </span>
                                    ) : logData.status.toUpperCase() ===
                                      "STARTED" ? (
                                        <span className="warning">
                                            {logData.status.toUpperCase()}
                                        </span>
                                    ) : logData.status.toUpperCase() ===
                                      "PENDING" ? (
                                        <span className="gray">
                                            {logData.status.toUpperCase()}
                                        </span>
                                    ) : (
                                        <span className="danger">
                                            {logData.status.toUpperCase()}
                                        </span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="w-25">
                                    <b>HTTP Status:</b>
                                </td>
                                <td className="w-75">{logData.status_code}</td>
                            </tr>
                            <tr>
                                <td className="w-25">
                                    <b>HTTP method :</b>
                                </td>
                                <td className="w-75">{logData.http_method}</td>
                            </tr>

                            <tr>
                                <td className="w-25">
                                    <b>Request JSON :</b>
                                </td>
                                <td className="w-75">
                                    <pre>{formattedRequestJson}</pre>
                                </td>
                            </tr>

                            {response !== "null" && (
                                <tr>
                                    <td className="w-25">
                                        <b>Response :</b>
                                    </td>
                                    <td className="w-75">
                                        <pre>{response}</pre>
                                    </td>
                                </tr>
                            )}

                            <tr>
                                <td className="w-25">
                                    <b>Date Time :</b>
                                </td>
                                <td className="w-75">
                                    <Time
                                        value={logData.timestamp}
                                        format="hh:mm:ss DD-MM-YYYY"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="w-25">
                                    <b>Processing Time :</b>
                                </td>
                                <td className="w-75">
                                    {parseFloat(
                                        logData.processing_time
                                    ).toFixed(4)}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {Object.keys(networkList).length > 0 && (
                        <div className="mt-10" id="networkList">
                            <div className="mt-10 mb-10">
                                <b>Response :</b>
                            </div>

                            <div className="listTitle">
                                Following ONIE devices identified from the
                                repective networks provided for SONiC
                                installation
                            </div>

                            <div className="" style={{ overflowX: "auto" }}>
                                <table id="networkListTable">
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
                                                        selectAllIp(e);
                                                    }}
                                                />
                                            </th>
                                            <th id="discoverAll">
                                                Discover All
                                                <input
                                                    className="ml-10"
                                                    type="checkbox"
                                                    disabled={!selectAll}
                                                    onChange={(e) => {
                                                        selectDiscoverAll(e);
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
                                        {Object.keys(networkList).map((key) => (
                                            <React.Fragment key={key}>
                                                {networkList[key].map(
                                                    (entry, index) => (
                                                        <tr
                                                            key={index}
                                                            id={index}
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {index === 0 ? (
                                                                <td
                                                                    rowSpan={
                                                                        networkList[
                                                                            key
                                                                        ].length
                                                                    }
                                                                    id="deviceNameFromNetwork"
                                                                >
                                                                    {key}
                                                                </td>
                                                            ) : null}

                                                            <td>
                                                                {entry.mgt_ip}
                                                            </td>

                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    id="selectDevice"
                                                                    disabled={
                                                                        selectAll
                                                                    }
                                                                    checked={
                                                                        selectedNetworkDevices.filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item
                                                                                    .device_ips[0] ===
                                                                                entry.mgt_ip
                                                                        )
                                                                            .length >
                                                                        0
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handelNetworkChecked(
                                                                            e,
                                                                            entry.mgt_ip
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    id="discoverDevice"
                                                                    disabled={discoverDisabled(
                                                                        entry.mgt_ip
                                                                    )}
                                                                    checked={
                                                                        selectedNetworkDevices.filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item
                                                                                    .device_ips[0] ===
                                                                                    entry.mgt_ip &&
                                                                                item.discover_also
                                                                        )
                                                                            .length >
                                                                        0
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handelNetworkDiscoveryChecked(
                                                                            e,
                                                                            entry.mgt_ip
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Manufacture Date"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Label Revision"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Platform Name"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "ONIE Version"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Manufacturer"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Country Code"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Diag Version"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Base MAC Address"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Serial Number"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Part Number"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Product Name"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "MAC Addresses"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "Vendor Name"
                                                                    ]
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    entry[
                                                                        "CRC-32"
                                                                    ]
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <button
                                    className="btnStyle mt-15 mr-15"
                                    onClick={applyConfig}
                                    id="applyConfigBtn"
                                >
                                    Apply Config
                                </button>
                            </div>
                        </div>
                    )}
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
                                    {Object.keys(installResponses).map(
                                        (key) => (
                                            <tr key={key}>
                                                <td className="w-40">{key}</td>

                                                {installResponses[key]
                                                    .output ? (
                                                    <td className="w-60  ">
                                                        <span
                                                            className={
                                                                isExpanded
                                                                    ? "expanded"
                                                                    : "textOverflow"
                                                            }
                                                        >
                                                            {
                                                                installResponses[
                                                                    key
                                                                ].output
                                                            }
                                                        </span>

                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "end",
                                                            }}
                                                        >
                                                            {isTextOverflow(
                                                                installResponses[
                                                                    key
                                                                ].output
                                                            ) && (
                                                                <div
                                                                    style={{
                                                                        textAlign:
                                                                            "end",
                                                                    }}
                                                                >
                                                                    <button
                                                                        className="btnStyle mt-10"
                                                                        onClick={
                                                                            handleToggle
                                                                        }
                                                                    >
                                                                        {isExpanded
                                                                            ? "Collapse"
                                                                            : "Expand"}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                ) : (
                                                    <td className="w-60 danger textOverflow ">
                                                        {
                                                            installResponses[
                                                                key
                                                            ].error
                                                        }
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="modalFooter">
                    {logData.status.toUpperCase() === "STARTED" ||
                    logData.status.toUpperCase() === "PENDING" ? (
                        <button
                            onClick={revoke}
                            className="btnStyle"
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
