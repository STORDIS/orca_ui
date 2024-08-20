import React, { useEffect, useState, useRef } from "react";
import "../Form.scss";
import useStoreConfig from "../../../utils/configStore";
import { isValidIPv4WithCIDR } from "../../../utils/common";
import { getInterfaceDataCommon } from "../interfaces/interfaceDataTable";
import { getVlanDataCommon } from "../vlan/vlanTable";

const PortChannelForm = ({ onSubmit, selectedDeviceIp, onClose }) => {
    const selectRef = useRef(null);
    const selectRefInterface = useRef(null);
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const [selectedInterfaces, setSelectedInterfaces] = useState([]);
    const [interfaceNames, setInterfaceNames] = useState([]);
    const [vlanNames, setVlanNames] = useState([]);
    const [selectedVlans, setSelectedVlans] = useState({
        vlan_ids: [],
        if_mode: "TRUNK",
    });

    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        lag_name: undefined,
        admin_sts: "up",
        mtu: 9100,
        members: undefined,
        static: false,
        fallback: false,
        fast_rate: false,
        graceful_shutdown_mode: "disable",
        min_links: 1,
        ip_address: undefined,
        description: undefined,
        vlan_members: undefined,
    });

    useEffect(() => {
        setVlanNames([]);

        getVlanDataCommon(selectedDeviceIp).then((res) => {
            const names = res
                .filter((item) => item?.name?.includes("Vlan"))
                .map((item) => ({
                    name: item?.name,
                    vlanid: item?.vlanid,
                }));
            setVlanNames(names);
        });

        setInterfaceNames([]);

        getInterfaceDataCommon(selectedDeviceIp).then((response) => {
            const fetchedInterfaceNames = response
                .map((item) => item.name)
                .filter((item) => item?.includes("Ethernet"));
            setInterfaceNames(fetchedInterfaceNames);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "mtu" && parseInt(value) < 0) {
            return;
        }

        if (value === "true" || value === "false") {
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
    };

    const handleDropdownChangeInterface = (event) => {
        let newValue = event.target.value;

        setSelectedInterfaces((prev) => {
            if (!prev?.includes(newValue)) {
                return [...prev, newValue];
            }
            return prev;
        });

        setInterfaceNames((prev) => prev.filter((item) => item !== newValue));
        selectRefInterface.current.value = "DEFAULT";
    };

    const handleRemoveInterface = (key) => {
        setInterfaceNames((prev) => {
            const exist = prev.some((item) => item === key);
            if (!exist) {
                return [...prev, key];
            }
            return prev;
        });

        setSelectedInterfaces((prev) => {
            return prev.filter((item) => item !== key);
        });

        setUpdateConfig(false);
    };

    const handleValue = (e) => {
        if (!/^PortChannel\d+$/.test(e.target.value)) {
            alert(
                'Invalid lag_name format. It should follow the pattern "PortChannel..." where "..." is a numeric value.'
            );
            return;
        }
    };

    const handleRemoveVlan = (key) => {
        setVlanNames((prevVlans) => {
            const vlanExists = prevVlans.some((vlan) => vlan.vlanid === key);

            if (!vlanExists) {
                return [...prevVlans, { name: `Vlan${key}`, vlanid: key }];
            }

            return prevVlans;
        });

        setSelectedVlans((prevState) => {
            return {
                ...prevState,
                vlan_ids: prevState.vlan_ids.filter((vlan) => vlan !== key),
            };
        });
    };

    const handleDropdownChangeVlan = (event) => {
        let value = event.target.value;

        setSelectedVlans((prevState) => {
            if (value === "TRUNK" || value === "ACCESS") {
                return {
                    vlan_ids: [],
                    if_mode: value,
                };
            } else {
                setVlanNames((prevVlans) =>
                    prevVlans.filter((item) => item.vlanid !== parseInt(value))
                );

                if (prevState.if_mode === "TRUNK") {
                    const vlanExists = prevState.vlan_ids.some(
                        (vlan) => vlan === parseInt(value)
                    );
                    return {
                        ...prevState,
                        vlan_ids: vlanExists
                            ? prevState.vlan_ids
                            : [...prevState.vlan_ids, parseInt(value)],
                    };
                } else {
                    return {
                        ...prevState,
                        vlan_ids: [parseInt(value)],
                    };
                }
            }
        });

        selectRef.current.value = "DEFAULT";
    };

    const handleSubmit = (e) => {
        if (formData.lag_name === "" || formData.lag_name === undefined) {
            alert("Channel Name is not valid");
            return;
        }

        if (
            !isValidIPv4WithCIDR(formData.ip_address) &&
            formData.ip_address !== "" &&
            formData.ip_address !== undefined
        ) {
            alert("ip_address is not valid");
            return;
        }

        if (
            formData.min_links !== "" &&
            (formData.min_links < 1 || formData.min_links > 33)
        ) {
            alert("min_links is not valid");
            return;
        }

        if (selectedVlans.vlan_ids.length > 0) {
            formData.vlan_members = selectedVlans;
        } else {
            delete formData.vlan_members;
        }

        if (selectedInterfaces.length > 0) {
            formData.members = selectedInterfaces;
        } else {
            delete formData.members;
        }

        onSubmit(formData);
    };

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
                        defaultValue={"up"}
                    >
                        <option selected value="up">
                            up
                        </option>
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
                <div className="form-field w-50">
                    <label> Static:</label>
                    <select
                        name="static"
                        value={formData.static}
                        onChange={handleChange}
                        defaultValue={false}
                    >
                        <option selected value={true}>
                            True
                        </option>
                        <option value={false}>False</option>
                    </select>
                </div>
                <div className="form-field w-50">
                    <label>Fallback:</label>
                    <select
                        name="fallback"
                        value={formData.fallback}
                        onChange={handleChange}
                        defaultValue={false}
                    >
                        <option selected value={true}>
                            True
                        </option>
                        <option value={false}>False</option>
                    </select>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label> Fast Rate:</label>
                    <select
                        name="fast_rate"
                        value={formData.fast_rate}
                        onChange={handleChange}
                        defaultValue={false}
                    >
                        <option selected value={true}>
                            True
                        </option>
                        <option value={false}>False</option>
                    </select>
                </div>
                <div className="form-field w-50">
                    <label>Graceful Shutdown Mode:</label>
                    <select
                        name="graceful_shutdown_mode"
                        value={formData.graceful_shutdown_mode}
                        onChange={handleChange}
                        defaultValue={"enable"}
                    >
                        <option selected value="enable">
                            Enable
                        </option>
                        <option value="disable">Disable</option>
                    </select>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-50">
                    <label>
                        Min Link <span className="note">(1-32)</span> :
                    </label>
                    <input
                        type="number"
                        max={32}
                        min={1}
                        name="min_links"
                        value={formData.min_links}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-field w-50">
                    <label>Ip Address:</label>
                    <input
                        type="text"
                        name="ip_address"
                        value={formData.ip_address}
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

            <div className="form-wrapper">
                <div className="form-field w-75">
                    <label>Ethernet Members:</label>
                    <select
                        onChange={handleDropdownChangeInterface}
                        defaultValue={"DEFAULT"}
                        ref={selectRefInterface}
                    >
                        <option value="DEFAULT" disabled>
                            Select Member Interface
                        </option>
                        {interfaceNames.map((member, index) => (
                            <option key={index} value={member}>
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
                                    disabled={updateConfig}
                                    onClick={() => handleRemoveInterface(value)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>

            <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-50">
                    <label>Interface mode:</label>
                </div>
                <div className="form-field w-50">
                    <select
                        onChange={handleDropdownChangeVlan}
                        defaultValue={"TRUNK"}
                    >
                        <option value="TRUNK">TRUNK</option>
                        <option value="ACCESS">ACCESS</option>
                    </select>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-75">
                    <label>Access Vlan:</label>
                    <select
                        onChange={handleDropdownChangeVlan}
                        defaultValue={"DEFAULT"}
                        ref={selectRef}
                    >
                        <option value="DEFAULT" disabled>
                            Select Vlan
                        </option>
                        {vlanNames.map((val, index) => (
                            <option key={index} value={val.vlanid}>
                                {val.name}
                            </option>
                        ))}
                    </select>

                    {selectedVlans.if_mode === "ACCESS" ? (
                        <small className="mt-10">
                            Note: Access mode can only have one vlan
                        </small>
                    ) : null}
                </div>
                <div className="form-field mt-25">
                    {selectedVlans?.vlan_ids?.length} selected
                </div>
            </div>

            <div className="selected-interface-wrap mb-10 w-100">
                {selectedVlans?.vlan_ids.map((value, index) => (
                    <div className="selected-interface-list mb-10">
                        <div className="ml-10 w-75">
                            {index + 1} &nbsp; Vlan{value}
                        </div>
                        <div className=" w-25">
                            <button
                                className="btnStyle mr-25"
                                disabled={updateConfig}
                                onClick={() => handleRemoveVlan(value)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="">
                <button
                    type="submit"
                    className="btnStyle mr-10"
                    disabled={updateConfig}
                >
                    Apply Config
                </button>
                <button
                    type="button"
                    className="btnStyle mr-10"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default PortChannelForm;
