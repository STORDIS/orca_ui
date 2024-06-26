import React, { useEffect, useState } from "react";
import "../Form.scss";
import { getAllInterfacesOfDeviceURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const PortChannelForm = ({
    onSubmit,
    selectedDeviceIp,
    onCancel,
    handelSubmitButton,
}) => {
    // const [disableSubmit, setDisableSubmit] = useState(handelSubmitButton);
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const instance = interceptor();

    const [selectedInterfaces, setSelectedInterfaces] = useState([]);
    const [interfaceNames, setInterfaceNames] = useState([]);

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
        onSubmit(formData);
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

    const handleRemove = (key) => {
        setSelectedInterfaces((prev) => {
            return prev.filter((item) => item !== key);
        });

        setDisableConfig(false);
    };

    const handleValue = (e) => {
        if (!/^PortChannel\d+$/.test(e.target.value)) {
            alert(
                'Invalid lag_name format. It should follow the pattern "PortChannel..." where "..." is a numeric value.'
            );
            return;
        }
    };

    useEffect(() => {
        instance
            .get(getAllInterfacesOfDeviceURL(selectedDeviceIp))
            .then((response) => {
                const fetchedInterfaceNames = response.data
                    .map((item) => item.name)
                    .filter((item) => item.includes("Ethernet"));
                setInterfaceNames(fetchedInterfaceNames);
            })
            .catch((error) => {
                console.error("Error fetching interface names", error);
            });
    }, []);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(formData);
            }}
            className=""
        >
            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>Device IP:</label>
                    <input type="text" value={selectedDeviceIp} disabled />
                </div>
                <div className="form-field w-50">
                    <label htmlFor="lag-name">Channel Name:</label>
                    <input
                        type="text"
                        name="lag_name"
                        value={formData.lag_name}
                        onChange={handleChange}
                        onBlur={handleValue}
                    />
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
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
                <div className="form-field w-75">
                    <label>Members:</label>
                    <select
                        onChange={handleDropdownChange}
                        defaultValue={"DEFAULT"}
                    >
                        <option value="DEFAULT" disabled>
                            Select Member Interface
                        </option>
                        {interfaceNames.map((member) => (
                            <option key={member} value={member}>
                                {member}
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
                        <div className="selected-interface-list mb-10">
                            <div key={key} className="ml-10 w-50">
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
    );
};

export default PortChannelForm;
