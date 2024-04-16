import React, { useEffect, useState } from "react";
import "./tabbedpane/Form.scss";
import { useDisableConfig } from "../utils/dissableConfigContext";

const VlanForm = ({
    onSubmit,
    selectedDeviceIp,
    onCancel,
    handelSubmitButton,
}) => {
    // const [disableSubmit, setDisableSubmit] = useState(handelSubmitButton);
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        vlanid: 0,
        name: "",
        admin_sts: "",
        mtu: 9100,
    });
    const [selectedInterfaces, setSelectedInterfaces] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "vlanid") {
            const vlanName = `Vlan${value}`;
            setFormData((prevFormData) => ({
                ...prevFormData,
                vlanid: value,
                name: vlanName,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        setDisableConfig(true);

        e.preventDefault();

        const vlanid = parseFloat(formData.vlanid);
        if (vlanid < 0) {
            alert("VLAN ID cannot be Negative.");
            return;
        }

        const dataToSubmit = {
            ...formData,
            vlanid,
            members: selectedInterfaces.join(", "),
        };
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
        <div className="">
            <form onSubmit={handleSubmit} className="vlan-form">
                <div className="form-field">
                    <label>Device IP:</label>
                    <span>{selectedDeviceIp}</span>
                </div>

                <div className="form-field">
                    <label>VLAN_ID:</label>
                    <input
                        type="number"
                        name="vlanid"
                        value={formData.vlanid}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled
                    />
                </div>

                <div className="form-field">
                    <label>Admin Status:</label>
                    <select
                        name="admin_sts"
                        value={formData.admin_sts}
                        onChange={handleChange}
                    >
                        <option value="up">up</option>
                        <option value="down">down</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>MTU:</label>
                    <input
                        type="number"
                        name="mtu"
                        value={formData.mtu}
                        onChange={handleChange}
                    />
                </div>

                <div className="">
                    {/* <input type="submit" value="Submit" /> */}
                    <button
                        type="submit"
                        className="btnStyle mr-10"
                        disabled={disableConfig}
                    >
                        Apply Config
                    </button>

                    <button
                        type="button"
                        className="btnStyle"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VlanForm;
