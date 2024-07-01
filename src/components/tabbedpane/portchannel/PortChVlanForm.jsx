import React, { useState, useEffect } from "react";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import interceptor from "../../../utils/interceptor";

import {
    getAllInterfacesOfDeviceURL,
    getAllPortChnlsOfDeviceURL,
} from "../../../utils/backend_rest_urls";

const PortChVlanForm = ({
    onSubmit,
    inputData,
    selectedDeviceIp,
    onCancel,
}) => {
    const [interfaceNames, setInterfaceNames] = useState([]);
    const [selectedInterfaces, setSelectedInterfaces] = useState([]);
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const instance = interceptor();

    useEffect(() => {
        getAllInterfaces();

        if (Array.isArray(inputData.members)) {
            setSelectedInterfaces(inputData.members);
        } else {
            setSelectedInterfaces(inputData.members.split(","));
        }
    }, []);

    const getAllInterfaces = () => {
        const apiPUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        instance
            .get(apiPUrl)
            .then((res) => {
                const names = res.data
                    .filter((item) => item.name.includes("Vlan"))
                    .map((item) => ({
                        name: item.name,
                        id: item.id,
                        taggingMode: "",
                    }));
                setInterfaceNames(names);
                console.log(names);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleRemove = (key) => {
        setDisableConfig(true);
        let selectedMembers = inputData.members;

        if (selectedMembers.includes(key)) {
            handelDeleteMemeber(key);
        } else {
            setSelectedInterfaces((prev) => {
                return prev.filter((item) => item !== key);
            });

            setDisableConfig(false);
        }
    };

    const handelDeleteMemeber = (e) => {
        setDisableConfig(true);

        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        const output = {
            mgt_ip: selectedDeviceIp,
            members: [e],
            lag_name: inputData.lag_name,
        };
        instance
            .delete(apiPUrl, { data: output })
            .then((response) => {
                setSelectedInterfaces((prev) => {
                    return prev.filter((item) => item !== e);
                });
                setDisableConfig(false);
            })
            .catch((err) => {})
            .finally(() => {
                setDisableConfig(false);
            });
    };

    const handleSubmit = (e) => {
        let dataToSubmit = [
            {
                mgt_ip: selectedDeviceIp,
                lag_name: inputData.lag_name,
                vlan_members: selectedInterfaces,
            },
        ];

        console.log(dataToSubmit);

        // onSubmit(dataToSubmit);
    };

    const handleCheckbox = (key, value) => {
        const hasTagged = selectedInterfaces.some(
            (iface) => iface.taggingMode === "ACCESS"
        );

        if (!hasTagged) {
            setSelectedInterfaces((prevInterfaces) => {
                prevInterfaces[key].taggingMode = "ACCESS";
                return [...prevInterfaces];
            });
        } else if (selectedInterfaces[key].taggingMode === "ACCESS") {
            setSelectedInterfaces((prevInterfaces) => {
                prevInterfaces[key].taggingMode = "TRUNK";
                return [...prevInterfaces];
            });
        }
    };

    console.log(selectedInterfaces);

    const handleDropdownChange = (event) => {
        let value = JSON.parse(event.target.value);

        setSelectedInterfaces((prevState) => {
            // Ensure prevInterfaces is always an array
            if (!Array.isArray(prevState)) {
                return [value];
            }
            return [...prevState, value];
        });
    };

    return (
        <div>
            <div className="form-wrapper">
                <div className="form-field w-75">
                    <select
                        onChange={handleDropdownChange}
                        defaultValue={"DEFAULT"}
                    >
                        <option value="DEFAULT" disabled>
                            Select Vlan Member
                        </option>
                        {interfaceNames.map((val, index) => (
                            <option key={index} value={JSON.stringify(val)}>
                                {val.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-field ">
                    {Object.keys(selectedInterfaces).length} selected
                </div>
            </div>

            <div className="selected-interface-wrap mb-10 w-100">
                {Object.entries(selectedInterfaces).map(
                    ([key, value], index) => (
                        <div className="selected-interface-list mb-10">
                            <div key={key} className="ml-10 w-50">
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
                                    disabled={disableConfig}
                                    onClick={() => handleRemove(key)}
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

export default PortChVlanForm;
