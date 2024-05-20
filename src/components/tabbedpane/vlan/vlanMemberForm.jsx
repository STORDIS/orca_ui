import React, { useEffect, useState } from "react";
import "../Form.scss";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import {
    getAllInterfacesOfDeviceURL,
    getAllPortChnlsOfDeviceURL,
} from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";

const VlanMemberForm = ({
    onSubmit,
    inputData,
    selectedDeviceIp,
    onCancel,
    handelSubmitButton,
}) => {
    const instance = interceptor();
    const { disableConfig, setDisableConfig } = useDisableConfig();
    const [selectedInterfaces, setSelectedInterfaces] = useState([]);
    const [interfaceNames, setInterfaceNames] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let dataToSubmit = {
            mgt_ip: selectedDeviceIp,
            name: inputData[0].name,
            vlanid: inputData[0].vlanid,
            members: selectedInterfaces,
        };

        console.log(dataToSubmit);
        setDisableConfig(true);
        onSubmit(dataToSubmit);
    };

    const getInterfaces = () => {
        instance
            .get(getAllInterfacesOfDeviceURL(selectedDeviceIp))
            .then((response) => {
                const ethernetInterfaces = response.data
                    .filter((element) => element.name.includes("Ethernet"))
                    .map((element) => element.name);

                setInterfaceNames((prev) => [...prev, ...ethernetInterfaces]);
            })
            .catch((error) => {
                console.error("Error fetching interface names", error);
            })
            .finally(() => {});
    };

    const getPortchannel = () => {
        instance
            .get(getAllPortChnlsOfDeviceURL(selectedDeviceIp))
            .then((response) => {
                const portchannel = response.data.map(
                    (element) => element.lag_name
                );

                setInterfaceNames((prev) => [...prev, ...portchannel]);
            })
            .catch((error) => {
                console.error("Error fetching interface names", error);
            });
    };

    useEffect(() => {
        setInterfaceNames([]);
        getInterfaces();
        getPortchannel();
    }, []);

    const handleDropdownChange = (event) => {
        const selectedValue = {
            [event.target.value]: "ACCESS",
        };

        setSelectedInterfaces((prev) => [...prev, selectedValue]);
    };

    const handleCheckbox = (index, value) => {
        setSelectedInterfaces((prevState) => {
            const newInterfaces = [...prevState];

            if (Object.values(value)[0] === "ACCESS") {
                newInterfaces[index] = {
                    [Object.keys(value)[0]]: "TRUNK",
                };
            } else {
                newInterfaces[index] = {
                    [Object.keys(value)[0]]: "ACCESS",
                };
            }

            return newInterfaces;
        });
    };

    const handleRemove = (index) => {
        setSelectedInterfaces((prevState) =>
            prevState.filter((_, i) => i !== index)
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-wrapper">
                <div className="form-field w-75">
                    <select onChange={handleDropdownChange}>
                        <option value="" disabled>
                            Select Member Interface
                        </option>
                        {interfaceNames.map((val, index) => (
                            <option key={index} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-field ">
                    {selectedInterfaces.length} selected
                </div>
            </div>

            <div className="selected-interface-wrap mb-10 w-100">
                {selectedInterfaces.map((val, index) => (
                    <div className="selected-interface-list mb-10">
                        <div className=" w-50">
                            {index + 1} &nbsp; {Object.keys(val)[0]}
                        </div>
                        <div className=" w-50">
                            <input
                                type="checkbox"
                                checked={Object.values(val)[0] === "TRUNK"}
                                onChange={() => handleCheckbox(index, val)}
                            />
                            <span className="ml-10">Tagged</span>

                            <button
                                className="btnStyle ml-10"
                                onClick={() => handleRemove(index, val)}
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
                >
                    Apply Config
                </button>

                <button type="button" className="btnStyle" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default VlanMemberForm;
