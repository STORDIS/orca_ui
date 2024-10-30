import React, { useEffect, useState } from "react";
import "./logModel.scss";
import Time from "react-time-format";

const SetupLogModal = ({ logData, onClose, onSubmit, title, id }) => {
    const [networkList, setNetworkList] = useState({});
    const [selectedNetworkDevices, setSelectedNetworkDevices] = useState([]);
    const [installResponses, setInstallResponses] = useState([]);

    const [selectAll, setSelectAll] = useState(false);
    const [response, setResponse] = useState("null");

    useEffect(() => {
        console.log(logData);
        if (
            logData?.response?.networks &&
            Object.keys(logData?.response?.networks).length > 0
        ) {
            setNetworkList(logData?.response?.networks);
        } else if (
            logData?.response?.install_responses &&
            Object.keys(logData?.response?.install_responses).length > 0
        ) {
            setInstallResponses(logData?.response?.install_responses);
        } else {
            setResponse(logData?.response);
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
                        user_name: logData?.request_json?.user_name,
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
                        user_name: logData?.request_json?.user_name,
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

    const applyConfig = () => {
        console.log(selectedNetworkDevices);
        // installImage(selectedNetworkDevices);
    };

    const formattedRequestJson = logData?.request_json
        ? Object.entries(logData?.request_json)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n") // Double newlines for extra space between pairs
        : "waiting for process to complete";

    return (
        <div className="modalContainer" onClick={onClose} id={id}>
            <div className="modalInner" onClick={(e) => e.stopPropagation()}>
                <h4 className="modalHeader">
                    {title}

                    <button className="btnStyle" onClick={onClose}>
                        Close
                    </button>
                </h4>

                <div className="modalBody mt-10 mb-10">
                    <table>
                        <tbody>
                            <tr>
                                <td className="w-25">
                                    <b>Status :</b>
                                </td>
                                <td className="w-75">
                                    {logData.status.toLowerCase() ===
                                    "success" ? (
                                        <span className="success">
                                            {logData.status}
                                        </span>
                                    ) : logData.status.toLowerCase() ===
                                      "started" ? (
                                        <span className="warning">
                                            {logData.status}
                                        </span>
                                    ) : logData.status.toLowerCase() ===
                                      "pending" ? (
                                        <span className="gray">
                                            {logData.status}
                                        </span>
                                    ) : (
                                        <span className="danger">
                                            {logData.status}
                                        </span>
                                    )}
                                    &nbsp;- {logData.status_code}
                                </td>
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

                            <div className="">
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
                                                            <td>{entry.ip}</td>
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
                                                                                entry.ip
                                                                        )
                                                                            .length >
                                                                        0
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        handelNetworkChecked(
                                                                            e,
                                                                            entry.ip
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    id="discoverDevice"
                                                                    disabled={discoverDisabled(
                                                                        entry.ip
                                                                    )}
                                                                    checked={
                                                                        selectedNetworkDevices.filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item
                                                                                    .device_ips[0] ===
                                                                                    entry.ip &&
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
                                                                            entry.ip
                                                                        );
                                                                    }}
                                                                />
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
                                                    <td className="w-60">
                                                        {
                                                            installResponses[
                                                                key
                                                            ].output
                                                        }
                                                    </td>
                                                ) : (
                                                    <td className="w-60 danger">
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
                {/* <div className="modalFooter">footer</div> */}
            </div>
        </div>
    );
};

export default SetupLogModal;
