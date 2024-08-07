import React, { useEffect, useState } from "react";
import "../Form.scss";
import useStoreConfig from "../../../utils/configStore";
import {
    getAllInterfacesOfDeviceURL,
    getAllPortChnlsOfDeviceURL,
    deleteVlanMembersURL,
} from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import { getInterfaceDataCommon } from "../interfaces/interfaceDataTable";
import { getPortChannelDataCommon } from "../portchannel/portChDataTable";

const VlanMemberForm = ({
    onSubmit,
    inputData,
    selectedDeviceIp,
    onCancel,
}) => {
    const instance = interceptor();
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const [selectedInterfaces, setSelectedInterfaces] = useState({});
    const [interfaceNames, setInterfaceNames] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let dataToSubmit = {
            mgt_ip: selectedDeviceIp,
            name: inputData.name,
            vlanid: inputData.vlanid,
            mem_ifs: selectedInterfaces,
        };
        setUpdateConfig(true);
        onSubmit(dataToSubmit);
    };

    const deleteMembers = (payload, key) => {
        setUpdateConfig(true);

        instance
            .delete(deleteVlanMembersURL(selectedDeviceIp), { data: payload })
            .then((response) => {
                setSelectedInterfaces((prevInterfaces) => {
                    const newInterfaces = { ...prevInterfaces };
                    delete newInterfaces[key];
                    return newInterfaces;
                });
                setUpdateConfig(false);
            })
            .catch((error) => {
                console.error("Error fetching interface names", error);
                setUpdateConfig(false);
            });
    };

    const handleRemove = (key) => {
        setUpdateConfig(true);

        let input_mem_if = JSON.parse(inputData.mem_ifs);

        if (input_mem_if.hasOwnProperty(key)) {
            let dataToSubmit = {
                mgt_ip: selectedDeviceIp,
                name: inputData.name,
                vlanid: inputData.vlanid,
                mem_ifs: { [key]: selectedInterfaces[key] },
            };

            deleteMembers(dataToSubmit, key);
        } else {
            setSelectedInterfaces((prevInterfaces) => {
                const newInterfaces = { ...prevInterfaces };
                delete newInterfaces[key];
                return newInterfaces;
            });
            setUpdateConfig(false);
        }
    };

    const handleDropdownChange = (event) => {
        setSelectedInterfaces((prev) => ({
            ...prev,
            [event.target.value]: "ACCESS",
        }));
    };

    const handleCheckbox = (key, value) => {
        setSelectedInterfaces((prevInterfaces) => ({
            ...prevInterfaces,
            [key]: value === "TRUNK" ? "ACCESS" : "TRUNK",
        }));
    };

    useEffect(() => {
        let input_mem_if = JSON.parse(inputData.mem_ifs);

        if (Object.keys(input_mem_if).length !== 0) {
            setSelectedInterfaces(input_mem_if);
        }

        setInterfaceNames([]);
        // getInterfaces();

        getInterfaceDataCommon(selectedDeviceIp).then((res) => {
            const ethernetInterfaces = res
                .filter((element) => element?.name?.includes("Ethernet"))
                .map((element) => element?.name);

            getPortChannelDataCommon(selectedDeviceIp).then((res) => {
                const portchannel = res.map((element) => element?.lag_name);

                setInterfaceNames([...ethernetInterfaces, ...portchannel]);
            });
        });
    }, []);

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
                        <div className="selected-interface-list mb-10">
                            <div key={key} className="ml-10 w-50">
                                {index + 1} &nbsp; {key}
                            </div>
                            <div className=" w-50">
                                <input
                                    type="checkbox"
                                    checked={value === "TRUNK"}
                                    onChange={() => handleCheckbox(key, value)}
                                />
                                <span className="ml-10">Tagged</span>

                                <button
                                    className="btnStyle ml-25"
                                    disabled={updateConfig}
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

export default VlanMemberForm;
