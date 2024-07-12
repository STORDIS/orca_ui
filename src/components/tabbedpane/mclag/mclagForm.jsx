import React, { useState, useEffect } from "react";

import { getAllPortChnlsOfDeviceURL } from "../../../utils/backend_rest_urls";
import "../Form.scss";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import interceptor from "../../../utils/interceptor";

const MclagForm = ({
    onSubmit,
    selectedDeviceIp,
    onCancel,
    handelSubmitButton,
}) => {
    const { disableConfig, setDisableConfig } = useDisableConfig();
    const [interfaceNames, setInterfaceNames] = useState([]);
    const [selectedInterfaces, setSelectedInterfaces] = useState([]);
    const instance = interceptor();

    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        domain_id: 1,
        source_address: undefined,
        peer_addr: undefined,
        peer_link: undefined,
        mclag_sys_mac: undefined,
        mclag_members: [],
        keepalive_interval: 1,
        session_timeout: 30,
        delay_restore: 300,
        session_vrf: undefined,
        fast_convergence: "enable",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedValue;
        if (
            name === "domain_id" ||
            name === "keepalive_interval" ||
            name === "session_timeout" ||
            name === "delay_restore"
        ) {
            updatedValue = parseInt(value);
        } else {
            updatedValue = value;
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: updatedValue,
        }));
    };

    const handleSubmit = (e) => {
        if (formData.domain_id === undefined) {
            alert(" Domain ID is mandatory.");
            return;
        }
        if (formData.domain_id === undefined) {
            alert(" Domain ID is mandatory.");
            return;
        }
        if (
            formData.mclag_sys_mac !== undefined &&
            formData.mclag_sys_mac !== undefined &&
            !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(
                formData.mclag_sys_mac
            )
        ) {
            alert("Invalid MAC address.");
            return;
        }

        if (
            formData.peer_link !== undefined &&
            !/^PortChannel\d+$/.test(formData.peer_link)
        ) {
            alert("Invalid peer_link format.");
            return;
        }
        if (
            formData.source_address !== undefined &&
            formData.source_address !== undefined &&
            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                formData.source_address
            )
        ) {
            alert("Invalid source_address format.");
            return;
        }
        if (
            formData.peer_addr !== undefined &&
            formData.peer_addr !== undefined &&
            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                formData.peer_addr
            )
        ) {
            alert("Invalid peer_addr format.");
            return;
        }

        formData.mclag_members = selectedInterfaces;

        setDisableConfig(true);
        onSubmit(formData);
    };

    useEffect(() => {
        getPortchannel();
    }, []);

    const getPortchannel = () => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        instance
            .get(apiPUrl)
            .then((res) => {
                const names = res.data.map((item) => item.lag_name);
                setInterfaceNames(names);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleRemove = (key) => {
        setSelectedInterfaces((prev) => {
            return prev.filter((item) => item !== key);
        });
    };

    const handleDropdownChange = (event) => {
        setSelectedInterfaces((prev) => {
            const newValue = event.target.value;
            if (!prev.includes(newValue)) {
                return [...prev, newValue];
            }
            return prev;
        });
    };

    return (
        <div className="">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(formData);
                }}
                className="port-channel-form"
            >
                <div className="form-wrapper">
                    <div className="form-field w-50">
                        <label>Device IP:</label>
                        <input type="text" value={selectedDeviceIp} disabled />
                    </div>

                    <div className="form-field w-50">
                        <label htmlFor="lag-name"> Domain ID:</label>
                        <input
                            type="number"
                            min={1}
                            name="domain_id"
                            value={formData.domain_id}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-wrapper">
                    <div className="form-field w-50">
                        <label htmlFor="lag-name">
                            Mclag System mac Address:
                        </label>
                        <input
                            type="text"
                            name="mclag_sys_mac"
                            value={formData.mclag_sys_mac}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field w-50">
                        <label htmlFor="lag-name">source address :</label>
                        <input
                            type="text"
                            name="source_address"
                            value={formData.source_address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-wrapper">
                    <div className="form-field w-50">
                        <label htmlFor="lag-name">Peer address:</label>
                        <input
                            type="text"
                            name="peer_addr"
                            value={formData.peer_addr}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field w-50">
                        <label htmlFor="lag-name"> Peer Link:</label>
                        <input
                            type="text"
                            name="peer_link"
                            value={formData.peer_link}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-wrapper">
                    <div className="form-field w-50">
                        <label htmlFor="lag-name"> Keep Alive Interval:</label>
                        <input
                            type="number"
                            name="keepalive_interval"
                            value={formData.keepalive_interval}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field w-50">
                        <label htmlFor="lag-name">Session Timeout:</label>
                        <input
                            type="number"
                            name="session_timeout"
                            value={formData.session_timeout}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-wrapper">
                    <div className="form-field w-50">
                        <label htmlFor="lag-name"> Delay Restore:</label>
                        <input
                            type="number"
                            name="delay_restore"
                            value={formData.delay_restore}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field w-50">
                        <label htmlFor="lag-name"> Session VRF:</label>
                        <input
                            type="text"
                            name="session_vrf"
                            value={formData.session_vrf}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-wrapper">
                    <div className="form-field w-50">
                        <label> Fast Convergence:</label>
                        <select
                            name="fast_convergence"
                            value={formData.fast_convergence}
                            onChange={handleChange}
                        >
                            <option value="enable">Enable</option>
                            <option value="disable">Disable</option>
                        </select>
                    </div>

                    {/* <div className="form-field w-50">
                        <label htmlFor="lag-name">Gateway macs:</label>
                        <input
                            type="text"
                            name="gateway_macs"
                            value={formData.gateway_macs}
                            onChange={handleChange}
                        />
                    </div> */}
                </div>

                {/* <div className="form-wrapper">
                    <div className="form-field w-50">
                        <label> Role :</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="enable">Enable</option>
                            <option value="disable">Disable</option>
                        </select>
                    </div>
                </div> */}

                <div className="form-wrapper">
                    <div className="form-field w-75">
                        <label>Select Member Interface </label>
                        <select
                            onChange={handleDropdownChange}
                            defaultValue={"DEFAULT"}
                        >
                            <option value="DEFAULT" disabled>
                                Select Member Interface
                            </option>
                            {interfaceNames.map((val, index) => (
                                <option key={index} value={val}>
                                    {val}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field mt-25">
                        {Object.keys(selectedInterfaces).length} selected
                    </div>
                </div>

                <div className="selected-interface-wrap mb-10 w-100">
                    {Object.entries(selectedInterfaces).map(
                        ([key, value], index) => (
                            <div
                                key={key}
                                className="selected-interface-list mb-10"
                            >
                                <div className="ml-10 w-50">
                                    {index + 1} &nbsp; {value}
                                </div>
                                <div className=" w-50">
                                    <button
                                        className="btnStyle ml-25"
                                        disabled={disableConfig}
                                        onClick={() => handleRemove(value)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="">
                    <button
                        type="submit"
                        className="btnStyle mr-10"
                        disabled={disableConfig}
                    >
                        Apply Config
                    </button>
                    <button
                        type="button"
                        className="btnStyle mr-10"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MclagForm;
