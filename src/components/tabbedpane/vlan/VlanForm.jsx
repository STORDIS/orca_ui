import React, { useEffect, useState } from "react";
import "../Form.scss";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const VlanForm = ({
    onSubmit,
    selectedDeviceIp,
    onCancel,
    handelSubmitButton,
}) => {
    // const [disableSubmit, setDisableSubmit] = useState(handelSubmitButton);
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const isValidIPv4WithCIDR = (ipWithCidr) => {
        // Regular expression to match IPv4 address (0-255 in each octet)
        const ipv4Regex =
            /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
        // Regular expression to match CIDR notation (0-32)
        const cidrRegex = /^([0-9]|[12][0-9]|3[0-2])$/;

        // Split the input into IP address and CIDR part
        const [ip, cidr] = ipWithCidr.split("/");

        // Check if the IP address part is valid
        if (ipv4Regex.test(ip)) {
            // If CIDR part exists, check it
            if (cidr === undefined || cidrRegex.test(cidr)) {
                return true;
            }
        }
        return false;
    };

    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        name: "",
        vlanid: 0,
        mtu: 9000,
        enabled: false,
        description: "",
        ip_address: "",
        sag_ip_address: "",
        autostate: "",
    });
    const [selectedInterfaces, setSelectedInterfaces] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        console.log(name, value);

        if (name === "vlanid") {
            const vlanName = `Vlan${value}`;
            setFormData((prevFormData) => ({
                ...prevFormData,
                vlanid: value,
                name: vlanName,
            }));
        } else if (name === "enabled") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value === "true" ? true : false,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
        console.log(formData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const vlanid = parseFloat(formData.vlanid);
        if (vlanid < 0) {
            alert("VLAN ID cannot be Negative.");
            return;
        }
        console.log(
            formData.ip_address,
            isValidIPv4WithCIDR(formData.ip_address)
        );
        if (
            !isValidIPv4WithCIDR(formData.ip_address) &&
            formData.ip_address !== ""
        ) {
            alert("ip_address is not valid");
            return;
        }
        if (
            !isValidIPv4WithCIDR(formData.sag_ip_address) &&
            formData.sag_ip_address !== ""
        ) {
            alert("sag_ip_address is not valid");
            return;
        }
        if (formData.sag_ip_address && formData.ip_address) {
            alert("ip_address or sag_ip_address any one must be added");
            return;
        }

        const dataToSubmit = {
            ...formData,
            vlanid,
            // members: selectedInterfaces.join(", "),
        };

        console.log(dataToSubmit);

        setDisableConfig(true);
        onSubmit(dataToSubmit);
    };

    const handleInterfaceSelect = (event) => {
        const selectedOptions = Array.from(
            event.target.selectedOptions,
            (option) => option.value
        );
        setSelectedInterfaces(selectedOptions);
    };

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            members: selectedInterfaces.join(", "),
        }));
    }, [handelSubmitButton, selectedInterfaces]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>Device IP:</label>
                    <input type="text" value={selectedDeviceIp} disabled />
                    {/* <span>{selectedDeviceIp}</span> */}
                </div>

                <div className="form-field w-50">
                    <label>MTU:</label>
                    <input
                        type="number"
                        name="mtu"
                        value={formData.mtu}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>VLAN_ID:</label>
                    <input
                        type="number"
                        name="vlanid"
                        value={formData.vlanid}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                <div className="form-field w-50">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled
                    />
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>Autostate </label>
                    <input
                        type="text"
                        name="autostate"
                        value={formData.autostate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field w-50">
                    <label> Status:</label>
                    <select
                        name="enabled"
                        value={formData.enabled}
                        onChange={handleChange}
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label> IP address</label>
                    <input
                        type="text"
                        name="ip_address"
                        value={formData.ip_address}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field w-50">
                    <label>Anycast Address</label>
                    <input
                        type="text"
                        name="sag_ip_address"
                        value={formData.sag_ip_address}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-field">
                <label>Description</label>
                <textarea
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                ></textarea>
            </div>

            <div className="">
                <button
                    type="submit"
                    className="btnStyle mr-10"
                    disabled={disableConfig}
                >
                    Apply Config
                </button>

                <button type="button" className="btnStyle" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default VlanForm;
