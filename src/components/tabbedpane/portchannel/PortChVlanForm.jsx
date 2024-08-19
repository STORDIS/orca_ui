import React, { useState, useEffect, useRef } from "react";
import useStoreConfig from "../../../utils/configStore";
import interceptor from "../../../utils/interceptor";

import {
    getVlansURL,
    deletePortchannelVlanMemberURL,
    deletePortchannelVlanMemberAllURL,
} from "../../../utils/backend_rest_urls";

const PortChVlanForm = ({ onSubmit, inputData, selectedDeviceIp, onClose }) => {
    const [vlanNames, setVlanNames] = useState([]);

    // const [selectedVlans, setSelectedVlans] = useState([]);
    const [inputVlans, setInputVlans] = useState({
        vlan_ids: [],
        if_mode: "TRUNK",
    });

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const selectRef = useRef(null);

    const instance = interceptor();

    useEffect(() => {
        getAllVlans();

        if (JSON.parse(inputData.vlan_members).vlan_ids?.length > 0) {
            setInputVlans(JSON.parse(inputData.vlan_members));
        }
    }, []);

    const getAllVlans = () => {
        const apiPUrl = getVlansURL(selectedDeviceIp);
        instance
            .get(apiPUrl)
            .then((res) => {
                const names = res.data
                    .filter((item) => item?.name?.includes("Vlan"))
                    .map((item) => ({
                        name: item?.name,
                        vlanid: item?.vlanid,
                    }));
                setVlanNames(names);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleRemove = (key) => {
        let input_mem = JSON.parse(inputData.vlan_members);
        if (input_mem?.vlan_ids?.length > 0) {
            if (input_mem.vlan_ids.includes(key)) {
                handleRemoveOne({
                    vlan_ids: [key],
                    if_mode: input_mem.if_mode,
                });
            } else {
                setInputVlans((prevState) => {
                    return {
                        ...prevState,
                        vlan_ids: prevState.vlan_ids.filter(
                            (vlan) => vlan !== key
                        ),
                    };
                });
            }
        } else {
            setInputVlans((prevState) => {
                return {
                    ...prevState,
                    vlan_ids: prevState.vlan_ids.filter((vlan) => vlan !== key),
                };
            });
        }
    };

    const handleRemoveOne = (e) => {
        setUpdateConfig(true);
        let payload = {
            mgt_ip: selectedDeviceIp,
            lag_name: inputData.lag_name,
            mtu: inputData.mtu,
            admin_status: inputData.admin_sts,
            vlan_members: e,
        };
        const apiPUrl = deletePortchannelVlanMemberURL();
        instance
            .delete(apiPUrl, { data: payload })
            .then((res) => {
                getAllVlans();
                setUpdateConfig(false);
                onClose();
            })
            .catch((err) => {
                console.log(err);
                setUpdateConfig(false);
            });
    };

    const handleRemoveAll = () => {
        setUpdateConfig(true);
        const apiPUrl = deletePortchannelVlanMemberAllURL();
        let dataToSubmit = {
            mgt_ip: selectedDeviceIp,
            lag_name: inputData.lag_name,
            mtu: inputData.mtu,
            admin_status: inputData.admin_sts,
            vlan_members: inputData.vlan_members,
        };

        instance
            .delete(apiPUrl, { data: dataToSubmit })
            .then((res) => {
                getAllVlans();
                setUpdateConfig(false);
                onClose();
            })
            .catch((err) => {
                console.log(err);
                setUpdateConfig(false);
            });
    };

    const handleSubmit = (e) => {
        let dataToSubmit = {
            mgt_ip: selectedDeviceIp,
            lag_name: inputData.lag_name,
            vlan_members: inputVlans,
        };
        onSubmit(dataToSubmit);
    };

    const handleInterfaceMood = (event) => {
        const value = event.target.value;

        console.log("--", JSON.parse(inputData.vlan_members)?.if_mode);

        setInputVlans((prevState) => {
            if (
                value === "ACCESS" &&
                JSON.parse(inputData.vlan_members)?.if_mode === "ACCESS"
            ) {
                return {
                    vlan_ids: JSON.parse(inputData.vlan_members).vlan_ids,
                    if_mode: value,
                };
            } else if (
                value === "TRUNK" &&
                JSON.parse(inputData.vlan_members)?.if_mode === "TRUNK"
            ) {
                return {
                    vlan_ids: JSON.parse(inputData.vlan_members).vlan_ids,
                    if_mode: value,
                };
            } else {
                return {
                    vlan_ids: [],
                    if_mode: value,
                };
            }
        });
    };

    const handleDropdownChange = (event) => {
        let value = JSON.parse(event.target.value);

        setInputVlans((prevState) => {
            if (value === "TRUNK" || value === "ACCESS") {
                return {
                    vlan_ids: [],
                    if_mode: value,
                };
            } else {
                if (prevState.if_mode === "TRUNK") {
                    console.log("trunk");
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
                    console.log("access");

                    return {
                        ...prevState,
                        vlan_ids: [parseInt(value)],
                    };
                }
            }
        });

        selectRef.current.value = "DEFAULT";
    };

    return (
        <div>
            <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-50">
                    <label> Interface Mode </label>
                </div>
                <div className="form-field w-50">
                    <select
                        onChange={handleInterfaceMood}
                        value={inputVlans.if_mode}
                    >
                        <option value="TRUNK">TRUNK</option>
                        <option value="ACCESS">ACCESS</option>
                    </select>
                </div>
            </div>

            <div className="form-wrapper">
                <div className="form-field w-75">
                    <select
                        onChange={handleDropdownChange}
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
                    {inputVlans.if_mode === "ACCESS" ? (
                        <small className="mt-10">
                            Note: Access mode can only have one vlan
                        </small>
                    ) : null}
                </div>
                <div className="form-field ">
                    {inputVlans?.vlan_ids?.length} selected
                </div>
            </div>

            <div className="selected-interface-wrap mb-10 w-100">
                {inputVlans?.vlan_ids?.map((value, index) => (
                    <div className="selected-interface-list mb-10">
                        <div className="ml-10 w-75">
                            {index + 1} &nbsp; Vlan{value}
                        </div>
                        <div className=" w-25">
                            <button
                                className="btnStyle mr-25"
                                disabled={updateConfig}
                                onClick={() => handleRemove(value)}
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
                    onClick={handleSubmit}
                >
                    Apply Config
                </button>

                <button type="button" className="btnStyle" onClick={onClose}>
                    Cancel
                </button>
                <button
                    className="btnStyle ml-10"
                    disabled={
                        updateConfig || inputVlans?.vlan_ids?.length === 0
                    }
                    onClick={() => handleRemoveAll()}
                >
                    Remove All
                </button>
            </div>
        </div>
    );
};

export default PortChVlanForm;
