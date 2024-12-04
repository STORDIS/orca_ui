import React, { useState, useEffect, useRef } from "react";
import useStoreConfig from "../../../utils/configStore";
import interceptor from "../../../utils/interceptor";
import useStoreLogs from "../../../utils/store";

import {
    deletePortchannelVlanMemberURL,
    deletePortchannelVlanMemberAllURL,
} from "../../../utils/backend_rest_urls";
import { getVlanDataCommon } from "../vlan/vlanTable";

const PortChVlanForm = ({ onSubmit, inputData, selectedDeviceIp, onClose }) => {
    const [vlanNames, setVlanNames] = useState([]);

    const [inputVlans, setInputVlans] = useState({
        vlan_ids: [],
        if_mode: "TRUNK",
    });

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const selectRef = useRef(null);

    const instance = interceptor();

    useEffect(() => {
        let prevVlan = JSON.parse(inputData.vlan_members);

        if (prevVlan.vlan_ids?.length > 0) {
            setInputVlans(prevVlan);
        }
        getVlansWithOutSelected();
    }, []);

    const getVlansWithOutSelected = () => {
        getVlanDataCommon(selectedDeviceIp).then((res) => {
            let names = res
                .filter((item) => item?.name?.includes("Vlan"))
                .map((item) => ({
                    name: item?.name,
                    vlanid: item?.vlanid,
                }));
            let prevVlan = JSON.parse(inputData.vlan_members);

            let remainingVlans = names.filter(
                (vlan) => !prevVlan.vlan_ids?.includes(vlan?.vlanid)
            );
            setVlanNames(remainingVlans);
        });
    };

    const getAllVlans = () => {
        getVlanDataCommon(selectedDeviceIp).then((res) => {
            let names = res
                .filter((item) => item?.name?.includes("Vlan"))
                .map((item) => ({
                    name: item?.name,
                    vlanid: item?.vlanid,
                }));
            setVlanNames(names);
        });
    };

    const handleRemove = (key) => {
        let input_mem = JSON.parse(inputData.vlan_members);

        setVlanNames((prevVlans) => {
            const vlanExists = prevVlans.some((vlan) => vlan.vlanid === key);
            if (!vlanExists) {
                return [...prevVlans, { name: `Vlan${key}`, vlanid: key }];
            }
            return prevVlans;
        });

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
                console.error(err);
                setUpdateConfig(false);
            })
            .finally(() => {
                setUpdateLog(true);
            });
    };

    const handleRemoveAll = () => {
        setUpdateConfig(true);
        const apiPUrl = deletePortchannelVlanMemberAllURL();
        let dataToSubmit = {
            mgt_ip: selectedDeviceIp,
            lag_name: inputData.lag_name,
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
                console.error(err);
                setUpdateConfig(false);
            })
            .finally(() => {
                setUpdateLog(true);
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

        setInputVlans((prevState) => {
            if (
                value === "ACCESS" &&
                JSON.parse(inputData.vlan_members)?.if_mode === "ACCESS"
            ) {
                getVlansWithOutSelected();
                return {
                    vlan_ids: JSON.parse(inputData.vlan_members).vlan_ids,
                    if_mode: value,
                };
            } else if (
                value === "TRUNK" &&
                JSON.parse(inputData.vlan_members)?.if_mode === "TRUNK"
            ) {
                getVlansWithOutSelected();
                return {
                    vlan_ids: JSON.parse(inputData.vlan_members).vlan_ids,
                    if_mode: value,
                };
            } else {
                getAllVlans();
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
                    setVlanNames((prevVlans) =>
                        prevVlans.filter(
                            (item) => item.vlanid !== parseInt(value)
                        )
                    );
                    const vlanExists = prevState.vlan_ids.some(
                        (vlan) => vlan === parseInt(value)
                    );
                    return {
                        if_mode: prevState.if_mode,
                        vlan_ids: vlanExists
                            ? prevState.vlan_ids
                            : [...prevState.vlan_ids, parseInt(value)],
                    };
                } else {
                    let temp_id = prevState?.vlan_ids[0];

                    if (temp_id) {
                        setVlanNames((prevVlans) => [
                            ...prevVlans,
                            { name: `Vlan${temp_id}`, vlanid: temp_id },
                        ]);
                    }

                    setVlanNames((prevVlans) =>
                        prevVlans.filter(
                            (item) => item.vlanid !== parseInt(value)
                        )
                    );
                    return {
                        if_mode: prevState.if_mode,
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
                        name="interface_mode"
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
                        name="vlan_ids"
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
                <div className="form-field" id="vlanCount">
                    {inputVlans?.vlan_ids?.length} selected
                </div>
            </div>

            <div className="selected-interface-wrap mb-10 w-100">
                {inputVlans?.vlan_ids?.map((value, index) => (
                    <div
                        id={value}
                        key={value}
                        className="selected-interface-list mb-10"
                    >
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
                    id="applyConfigPortChannel"
                >
                    Apply Config
                </button>

                <button
                    type="button"
                    className="btnStyle"
                    onClick={onClose}
                    id="cancelConfigPortChannel"
                >
                    Cancel
                </button>
                <button
                    className="btnStyle ml-10"
                    disabled={
                        updateConfig || inputVlans?.vlan_ids?.length === 0
                    }
                    onClick={() => handleRemoveAll()}
                     id="RemoveAllVlanPortChannel"
                >
                    Remove All
                </button>
            </div>
        </div>
    );
};

export default PortChVlanForm;
