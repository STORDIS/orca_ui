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
        domain_id: "",
        source_address: "",
        peer_addr: "",
        peer_link: "",
        mclag_sys_mac: "",
        mclag_members: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedValue = name === "domain_id" ? parseInt(value, 10) : value;
        setFormData((prevState) => ({
            ...prevState,
            [name]: updatedValue,
        }));
    };

    const handleSubmit = (e) => {
        if (
            !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(
                formData.mclag_sys_mac
            )
        ) {
            alert("Invalid MAC address.");
            return;
        }

        if (!/^PortChannel\d+$/.test(formData.peer_link)) {
            alert("Invalid peer_link format.");
            return;
        }
        if (
            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                formData.source_address
            )
        ) {
            alert("Invalid source_address format.");
            return;
        }
        if (
            !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                formData.peer_addr
            )
        ) {
            alert("Invalid peer_addr format.");
            return;
        }

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
                <div className="form-field">
                    <label>Device IP:</label>
                    <span>{selectedDeviceIp}</span>
                </div>

                <div className="form-field">
                    <label htmlFor="lag-name"> Domain ID:</label>
                    <input
                        type="number"
                        name="domain_id"
                        value={formData.domain_id}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lag-name">Mclag System mac Address:</label>
                    <input
                        type="text"
                        name="mclag_sys_mac"
                        value={formData.mclag_sys_mac}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lag-name">source address :</label>
                    <input
                        type="text"
                        name="source_address"
                        value={formData.source_address}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lag-name">Peer address:</label>
                    <input
                        type="text"
                        name="peer_addr"
                        value={formData.peer_addr}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lag-name"> Peer Link:</label>
                    <input
                        type="text"
                        name="peer_link"
                        value={formData.peer_link}
                        onChange={handleChange}
                    />
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
