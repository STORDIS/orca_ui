import React, { useEffect, useState } from "react";
import "../Form.scss";
import useStoreConfig from "../../../utils/configStore";
import { putStpDataUtil } from "./stpDataTable";
import useStoreLogs from "../../../utils/store";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

const StpForm = ({ onSubmit, selectedDeviceIp, onCancel }) => {
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const [disableInput, setDisableInput] = useState("PVST");

    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        enabled_protocol: ["PVST"],
        bpdu_filter: true,
        bridge_priority: 4096,
        max_age: 6,
        hello_time: 1,
        rootguard_timeout: 5,
        loop_guard: false,
        portfast: false,
        forwarding_delay: 4,
        disabled_vlans: undefined,
    });

    useEffect(() => {}, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (value === "true" || value === "false") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value === "true" ? true : false,
            }));
        } else if (name === "enabled_protocol") {
            if (value === "PVST") {
                setDisableInput("PVST");
            } else if (value === "MSTP") {
                setDisableInput("MSTP");
            } else {
                setDisableInput("");
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: [value],
            }));
        } else if (
            name === "bridge_priority" ||
            name === "max_age" ||
            name === "hello_time" ||
            name === "rootguard_timeout" ||
            name === "forwarding_delay"
        ) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: parseInt(value),
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.enabled_protocol[0] === "MSTP") {
            delete formData.rootguard_timeout;
            delete formData.portfast;
        } else {
            delete formData.loop_guard;
            delete formData.portfast;
        }

        await putStpDataUtil(selectedDeviceIp, formData, (status) => {
            setUpdateConfig(status);
            setUpdateLog(!status);
        });
        onSubmit(formData);
    };

    const handleIncrease = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            bridge_priority:
                prevFormData.bridge_priority + 4096 <= 61440
                    ? prevFormData.bridge_priority + 4096
                    : 61440,
        }));
    };

    const handleDecrease = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            bridge_priority:
                prevFormData.bridge_priority - 4096 >= 4096
                    ? prevFormData.bridge_priority - 4096
                    : 4096,
        }));
    };

    return (
        <div>
            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>* Device IP :</label>
                    <input type="text" value={selectedDeviceIp} disabled />
                </div>

                <div className="form-field w-50">
                    <label>* Enabled Protocol :</label>
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
                    <label>* BPDU Filter :</label>
                    <select
                        value={formData.bpdu_filter}
                        name="bpdu_filter"
                        onChange={handleChange}
                    >
                        <option value="true">Enable</option>
                        <option value="false">Disable</option>
                    </select>
                </div>
                <div className="form-field  " style={{ width: "45%" }}>
                    <label>* Bridge Priority :</label>
                    <input
                        type="number"
                        name="bridge_priority"
                        value={formData.bridge_priority}
                        min={0}
                        max={61440}
                        readOnly
                        onChange={handleChange}
                    />
                    <small>Must Be Multiple of 4096</small>
                </div>
                <div className="form-field  mt-15" style={{ width: "5%" }}>
                    <Tooltip title="Increase" placement="right">
                        <button
                            className="increadeDecrease mb-5"
                            onClick={handleIncrease}
                        >
                            <FaArrowAltCircleUp />
                        </button>
                    </Tooltip>
                    <Tooltip title="Decrease" placement="right">
                        <button
                            className="increadeDecrease"
                            onClick={handleDecrease}
                        >
                            <FaArrowAltCircleDown />
                        </button>
                    </Tooltip>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>* Max Age:</label>
                    <input
                        type="number"
                        name="max_age"
                        value={formData.max_age}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-field w-50">
                    <label>* Hello Time:</label>
                    <input
                        type="number"
                        name="hello_time"
                        value={formData.hello_time}
                        min={1}
                        max={10}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label> Forwarding Delay:</label>
                    <input
                        type="number"
                        name="forwarding_delay"
                        value={formData.forwarding_delay}
                        min={4}
                        max={30}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field w-50">
                    <label> Portfast:</label>
                    <select
                        name="portfast"
                        value={formData.portfast}
                        onChange={handleChange}
                        disabled={disableInput === "PVST"}
                    >
                        <option value="true">Enable</option>
                        <option value="false">Disable</option>
                    </select>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label> Loop Guard:</label>
                    <select
                        name="loop_guard"
                        value={formData.loop_guard}
                        onChange={handleChange}
                        disabled={disableInput === "MSTP"}
                    >
                        <option value="true">Enable</option>
                        <option value="false">Disable</option>
                    </select>
                </div>

                <div className="form-field w-50">
                    <label> Rootguard Timeout:</label>
                    <input
                        type="number"
                        name="rootguard_timeout"
                        value={formData.rootguard_timeout}
                        min={5}
                        max={600}
                        onChange={handleChange}
                        disabled={disableInput === "MSTP"}
                    />
                </div>
            </div>

            <div className="">
                <button
                    type="submit"
                    className="btnStyle mr-10"
                    disabled={updateConfig}
                    onClick={handleSubmit}
                >
                    Apply Config
                </button>

                <button type="button" className="btnStyle" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};
export default StpForm;
