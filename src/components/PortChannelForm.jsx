import React, { useEffect, useState } from "react";
import "./tabbedpane/Form.scss";
import { getAllInterfacesOfDeviceURL } from "../backend_rest_urls";
import interceptor from "../interceptor";
const PortChannelForm = ({
    onSubmit,
    selectedDeviceIp,
    onCancel,
    handelSubmitButton,
}) => {
    const [disableSubmit, setDisableSubmit] = useState(handelSubmitButton);

    const instance = interceptor();

    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        lag_name: "",
        admin_sts: "",
        mtu: 9100,
        members: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "mtu" && parseInt(value) < 0) {
            return;
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        setDisableSubmit(true);
        onSubmit(formData);
    };

    const handleDropdownChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            members: e,
        }));
    };

    const handleValue = (e) => {
        console.log("valiue", e);
        if (!/^PortChannel\d+$/.test(e.target.value)) {
            alert(
                'Invalid lag_name format. It should follow the pattern "PortChannel..." where "..." is a numeric value.'
            );
            return;
        }
    };

    const [interfaceNames, setInterfaceNames] = useState([]);

    useEffect(() => {
        instance
            .get(getAllInterfacesOfDeviceURL(selectedDeviceIp))
            .then((response) => {
                const fetchedInterfaceNames = response.data.map(
                    (item) => item.name
                );
                setInterfaceNames(fetchedInterfaceNames);
            })
            .catch((error) => {
                console.error("Error fetching interface names", error);
            });
    }, []);

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
                    <label htmlFor="lag-name">Channel Name:</label>
                    <input
                        type="text"
                        name="lag_name"
                        value={formData.lag_name}
                        onChange={handleChange}
                        onBlur={handleValue}
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

                <div className="form-field">
                    <label>Members:</label>
                    {/* <select id="memberDropdown" onChange={handleDropdownChange}>
                        <option value="" disabled selected >
                            Select Member Interface
                        </option>
                        {interfaceNames.map((val, index) => (
                            <option key={index} value={val}>
                                {val}
                            </option>
                        ))}
                    </select> */}
                    <select
                        multiple
                        size="5"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                            handleDropdownChange(
                                Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                )
                            )
                        }
                    >
                        {interfaceNames.map((member) => (
                            <option key={member} value={member}>
                                {member}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="">
                    <button
                        type="submit"
                        className="btnStyle mr-10"
                        disabled={disableSubmit}
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

export default PortChannelForm;
