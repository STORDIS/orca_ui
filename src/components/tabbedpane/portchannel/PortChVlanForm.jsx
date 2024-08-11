import React, { useState, useEffect, useRef } from "react";
import useStoreConfig from "../../../utils/configStore";
import interceptor from "../../../utils/interceptor";

import {
    getVlansURL,
    deletePortchannelVlanMemberURL,
    deletePortchannelVlanMemberAllURL,
} from "../../../utils/backend_rest_urls";

const PortChVlanForm = ({
    onSubmit,
    inputData,
    selectedDeviceIp,
    onCancel,
}) => {
    const [vlanNames, setVlanNames] = useState([]);

    // const [selectedVlans, setSelectedVlans] = useState([]);
    const [inputVlans, setInputVlans] = useState({});

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const selectRef = useRef(null);

    const instance = interceptor();

    useEffect(() => {
        getAllVlans();
        console.log(JSON.parse(inputData.vlan_members));
        setInputVlans(JSON.parse(inputData.vlan_members));
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
        // let input_mem = JSON.parse(inputData.vlan_members);
        // if (input_mem) {
        //     if (input_mem.trunk_vlans?.includes(key.vlanid)) {
        //         handleRemoveOne({ trunk_vlans: [key.vlanid] });
        //     } else if (input_mem.access_vlan === key.vlanid) {
        //         handleRemoveOne({ access_vlan: key.vlanid });
        //     } else if (input_mem.trunk_vlans && input_mem.access_vlan) {
        //         setSelectedVlans((prev) => {
        //             return prev.filter((item) => item.vlanid !== key.vlanid);
        //         });
        //     }
        // }
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
                onCancel();
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
            vlan_members: JSON.parse(inputData.vlan_members),
        };

        instance
            .delete(apiPUrl, { data: dataToSubmit })
            .then((res) => {
                getAllVlans();
                setUpdateConfig(false);
                onCancel();
            })
            .catch((err) => {
                console.log(err);
                setUpdateConfig(false);
            });
    };

    const handleSubmit = (e) => {
        // let dataToSubmit = {
        //     mgt_ip: selectedDeviceIp,
        //     lag_name: inputData.lag_name,
        //     vlan_members: finalVlanMembers,
        // };
        // onSubmit(dataToSubmit);
    };

    const handleInterfaceMood = (event) => {
        const value = event.target.value;
        setInputVlans((prevState) => ({
            ...prevState,
            if_mode: value, // Update the if_mode with the selected value
        }));
    };

    const handleDropdownChange = (event) => {
        let value = JSON.parse(event.target.value);

        inputVlans((prevState) => {
            const vlanExists = prevState.some(
                (vlan) => vlan.name === value.name
            );

            if (!vlanExists) {
                return [...prevState, value];
            }

            return prevState;
        });
        selectRef.current.value = "DEFAULT";
    };

    console.log(inputVlans);

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
                            Select Vlan Member
                        </option>
                        {vlanNames.map((val, index) => (
                            <option key={index} value={JSON.stringify(val)}>
                                {val.name}
                            </option>
                        ))}
                    </select>
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
                                disabled={updateConfig || !value.removable}
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

                <button type="button" className="btnStyle" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    className="btnStyle ml-10"
                    disabled={updateConfig || inputVlans?.vlan_ids?.length === 0}
                    onClick={() => handleRemoveAll()}
                >
                    Remove All
                </button>
            </div>
        </div>
    );
};

export default PortChVlanForm;
