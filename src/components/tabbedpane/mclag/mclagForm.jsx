import React, { useState } from "react";
import "../Form.scss";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const MclagForm = ({
    onSubmit,
    selectedDeviceIp,
    onCancel,
    handelSubmitButton,
}) => {
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        domain_id: 1,
        source_address: undefined,
        peer_addr: undefined,
        peer_link: undefined,
        mclag_sys_mac: undefined,
        // mclag_members: [],
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
        if (
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
            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                formData.source_address
            )
        ) {
            alert("Invalid source_address format.");
            return;
        }
        if (
            formData.peer_addr !== undefined &&
            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                formData.peer_addr
            )
        ) {
            alert("Invalid peer_addr format.");
            return;
        }

        console.log(formData);
        setDisableConfig(true);

        onSubmit(formData);
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
