import React, { useState, useEffect, useRef } from "react";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import interceptor from "../../../utils/interceptor";

import {
    getVlansURL,
    deletePortchannelVlanMemberURL,
} from "../../../utils/backend_rest_urls";

const PortChVlanForm = ({
    onSubmit,
    inputData,
    selectedDeviceIp,
    onCancel,
}) => {
    const [vlanNames, setVlanNames] = useState([]);
    const [selectedVlans, setSelectedVlans] = useState([]);
    const [inputVlans, setInputVlans] = useState([]);
    const { disableConfig, setDisableConfig } = useDisableConfig();
    const selectRef = useRef(null);

    const instance = interceptor();

    useEffect(() => {
        getAllVlans();
    }, []);

    const getAllVlans = () => {
        setVlanNames([]);
        addSelectedVlans([]);

        const apiPUrl = getVlansURL(selectedDeviceIp);
        instance
            .get(apiPUrl)
            .then((res) => {
                const names = res.data
                    .filter((item) => item.name.includes("Vlan"))
                    .map((item) => ({
                        name: item.name,
                        vlanid: item.vlanid,
                        taggingMode: "",
                        removable: false,
                    }));
                setVlanNames(names);

                addSelectedVlans(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const addSelectedVlans = (res) => {
        setSelectedVlans([]);
        setInputVlans([]);
        let input_vlans = JSON.parse(inputData.vlan_members);

        if (Object.keys(input_vlans).length > 0) {
            let access_vlans = res
                .filter((item) => item?.vlanid === input_vlans?.access_vlan)
                .map((item) => ({
                    name: item?.name,
                    vlanid: item?.vlanid,
                    taggingMode: "ACCESS",
                    removable: false,
                }));

            let trunk_vlans = [];

            input_vlans?.trunk_vlans.forEach((element) => {
                const filteredItems = res
                    .filter((item) => item?.vlanid === element)
                    .map((item) => ({
                        name: item?.name,
                        vlanid: item.vlanid,
                        taggingMode: "",
                        removable: false,
                    }));
                trunk_vlans = trunk_vlans.concat(filteredItems);
            });

            setSelectedVlans([...access_vlans, ...trunk_vlans]);
            setInputVlans([...access_vlans, ...trunk_vlans]);
        }
    };

    const handleRemove = (key) => {
        setSelectedVlans((prev) => {
            return prev.filter((item) => item.vlanid !== key.vlanid);
        });
    };

    const handleRemoveAll = () => {
        setDisableConfig(true);

        const apiPUrl = deletePortchannelVlanMemberURL();

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
                setDisableConfig(false);
                onCancel();
            })
            .catch((err) => {
                console.log(err);
                setDisableConfig(false);
            });
    };

    const handleSubmit = (e) => {
        let finalVlanMembers = {
            access_vlan: "",
            trunk_vlans: [],
        };

        selectedVlans.forEach((element) => {
            if (element.taggingMode === "ACCESS") {
                finalVlanMembers.access_vlan = element.vlanid;
            } else {
                finalVlanMembers.trunk_vlans.push(element.vlanid);
            }
        });

        if (finalVlanMembers.access_vlan === "") {
            delete finalVlanMembers.access_vlan;
        }

        if (finalVlanMembers.trunk_vlans.length === 0) {
            delete finalVlanMembers.trunk_vlans;
        }

        let dataToSubmit = {
            mgt_ip: selectedDeviceIp,
            lag_name: inputData.lag_name,
            vlan_members: finalVlanMembers,
        };

        onSubmit(dataToSubmit);
    };

    const handleCheckbox = (key, value) => {
        const hasTagged = selectedVlans.some(
            (iface) => iface.taggingMode === "ACCESS"
        );

        if (!hasTagged) {
            setSelectedVlans((prevVlans) => {
                prevVlans[key].taggingMode = "ACCESS";
                return [...prevVlans];
            });
        } else if (selectedVlans[key].taggingMode === "ACCESS") {
            setSelectedVlans((prevVlans) => {
                prevVlans[key].taggingMode = "TRUNK";
                return [...prevVlans];
            });
        } else {
            alert("Only one Vlan can be Tagged");
        }
    };

    const handleDropdownChange = (event) => {
        let value = JSON.parse(event.target.value);
        value.removable = true;

        setSelectedVlans((prevState) => {
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

    return (
        <div>
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
                    {Object.keys(selectedVlans).length} selected
                </div>
            </div>

            <div className="selected-interface-wrap mb-10 w-100">
                {Object.entries(selectedVlans).map(([key, value], index) => (
                    <div className="selected-interface-list mb-10">
                        <div className="ml-10 w-50">
                            {index + 1} &nbsp; {value.name}
                        </div>
                        <div className=" w-50">
                            <input
                                type="checkbox"
                                checked={value.taggingMode === "ACCESS"}
                                onChange={() => handleCheckbox(key, value)}
                            />
                            <span className="ml-10">Tagged</span>

                            <button
                                className="btnStyle ml-25"
                                disabled={disableConfig || !value.removable}
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
                    disabled={disableConfig}
                    onClick={handleSubmit}
                >
                    Apply Config
                </button>

                <button type="button" className="btnStyle" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    className="btnStyle ml-10"
                    disabled={disableConfig}
                    onClick={() => handleRemoveAll()}
                >
                    Remove All
                </button>
            </div>
        </div>
    );
};

export default PortChVlanForm;
