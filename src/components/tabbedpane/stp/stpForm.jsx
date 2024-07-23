import React, { useEffect, useState } from "react";
import "../Form.scss";
import useStoreConfig from "../../../utils/configStore";
import interceptor from "../../../utils/interceptor";

const StpForm = ({ onSubmit, selectedDeviceIp, onCancel }) => {
    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        enabled_protocol: "PVST",
        bpdu_filter: undefined,
        forwarding_delay: undefined,
        hello_time: undefined,
        max_age: undefined,
        bridge_priority: undefined,
        disabled_vlans: undefined,
        rootguard_timeout: undefined,
        loop_guard: undefined,
        portfast: undefined,
    });

    useEffect(() => {}, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);

        if (value === "true" || value === "false") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value === "true" ? true : false,
            }));
        } else if (name === "enabled_protocol") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: [value],
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };
    console.log(formData);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleDropdownChange = (event) => {};

    const handleRemove = (key) => {};

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>Device IP:</label>
                    <input type="text" value={selectedDeviceIp} disabled />
                </div>

                <div className="form-field w-50">
                    <label>enabled_protocol </label>
                    <select
                        name="enabled_protocol"
                        value={formData.enabled_protocol}
                        onChange={handleChange}
                    >
                        <option value="PVST">PVST</option>
                        <option value="MSTP">MSTP</option>
                        <option value="RSTP">RSTP</option>
                        <option value="RAPID_PVST">RAPID_PVST</option>
                    </select>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>bpdu_filter:</label>
                    <select
                        name="bridge_priority"
                        value={formData.bpdu_filter}
                        onChange={handleChange}
                    >
                        <option value="true">Enable</option>
                        <option value="false">Disable</option>
                    </select>
                </div>
                <div className="form-field w-50">
                    <label>bridge_priority:</label>
                    <input
                        type="number"
                        value={formData.bridge_priority}
                        min={0}
                        max={61440}
                    />
                    <small>Must Be Multiple of 4096</small>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label> max_age:</label>
                    <input type="number" value={formData.max_age} />
                </div>
                <div className="form-field w-50">
                    <label> hello_time:</label>
                    <input
                        type="number"
                        value={formData.hello_time}
                        min={1}
                        max={10}
                    />
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label> rootguard_timeout:</label>
                    <input
                        type="number"
                        value={formData.rootguard_timeout}
                        min={5}
                        max={600}
                    />
                </div>
                <div className="form-field w-50">
                    <label> loop_guard:</label>
                    <select
                        name="loop_guard"
                        value={formData.loop_guard}
                        onChange={handleChange}
                    >
                        <option value="true">Enable</option>
                        <option value="false">Disable</option>
                    </select>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label> portfast:</label>
                    <select
                        name="loop_guard"
                        value={formData.portfast}
                        onChange={handleChange}
                    >
                        <option value="true">Enable</option>
                        <option value="false">Disable</option>
                    </select>
                </div>
                <div className="form-field w-50">
                    <label> forwarding_delay:</label>
                    <input
                        type="number"
                        value={formData.forwarding_delay}
                        min={4}
                        max={30}
                    />
                </div>
            </div>
        </form>
    );
};
export default StpForm;
