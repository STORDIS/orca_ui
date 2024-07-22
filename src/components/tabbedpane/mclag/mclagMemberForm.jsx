import React, { useState, useEffect } from "react";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import interceptor from "../../../utils/interceptor";
import { deleteMclagsMemberURL } from "../../../utils/backend_rest_urls";
import { getPortChannelDataUtil } from "../portchannel/portChDataTable";
import useStoreLogs from "../../../utils/store";

const MclagMemberForm = ({
    onSubmit,
    inputData,
    selectedDeviceIp,
    onCancel,
}) => {
    const [interfaceNames, setInterfaceNames] = useState([]);
    const [selectedInterfaces, setSelectedInterfaces] = useState([]);
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const instance = interceptor();
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    useEffect(() => {
        getPortchannel();

        console.log(inputData.mclag_members);

        if (inputData.mclag_members) {
            setSelectedInterfaces(JSON.parse(inputData.mclag_members));
        }
    }, []);

    const getPortchannel = () => {
        getPortChannelDataUtil(selectedDeviceIp).then((res) => {
            const names = res.map((item) => item.lag_name);
            setInterfaceNames(names);
        });
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
        let selectedMembers = JSON.parse(inputData.mclag_members);

        setDisableConfig(true);

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
        let payload = {
            mgt_ip: selectedDeviceIp,
            domain_id: inputData.domain_id,
            mclag_members: [e],
        };

        setDisableConfig(true);
        const apiPUrl = deleteMclagsMemberURL(selectedDeviceIp);
        instance
            .delete(apiPUrl, { data: payload })
            .then((res) => {
                setSelectedInterfaces((prev) => {
                    return prev.filter((item) => item !== e);
                });
            })
            .catch((err) => {})
            .finally(() => {
                setUpdateLog(true);
                setDisableConfig(false);
                getPortchannel();
            });
    };

    const removeAll = () => {
        let payload = {
            mgt_ip: selectedDeviceIp,
            domain_id: inputData.domain_id,
            mclag_members: JSON.parse(inputData.mclag_members),
        };

        setDisableConfig(true);
        const apiPUrl = deleteMclagsMemberURL(selectedDeviceIp);
        instance
            .delete(apiPUrl, { data: payload })
            .then((res) => {
                setSelectedInterfaces([]);
            })
            .catch((err) => {})
            .finally(() => {
                setUpdateLog(true);
                setDisableConfig(false);
                getPortchannel();
            });
    };

    const handleSubmit = (e) => {
        let dataToSubmit = {
            mgt_ip: selectedDeviceIp,
            domain_id: inputData.domain_id,
            mclag_members: selectedInterfaces,
        };

        console.log(dataToSubmit);
        onSubmit(dataToSubmit);
    };

    return (
        <div>
            <div className="form-wrapper">
                <div className="form-field w-75">
                    <label>Select Member Interface </label>
                    <select
                        onChange={handleDropdownChange}
                        defaultValue={"DEFAULT"}
                    >
                        <option value="DEFAULT" disabled>
                            Select Member Interface
                        </option>
                        {interfaceNames.map((val, index) => (
                            <option key={index} value={val}>
                                {val}
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
                        <div
                            key={key}
                            className="selected-interface-list mb-10"
                        >
                            <div className="ml-10 w-50">
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
                    onClick={handleSubmit}
                >
                    Apply Config
                </button>
                <button
                    type="button"
                    className="btnStyle mr-10"
                    disabled={disableConfig}
                    onClick={removeAll}
                >
                    Remove All
                </button>
                <button type="button" className="btnStyle" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MclagMemberForm;
