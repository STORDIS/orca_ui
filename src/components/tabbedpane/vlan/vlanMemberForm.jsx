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
    // const [disableSubmit, setDisableSubmit] = useState(handelSubmitButton);

    const { disableConfig, setDisableConfig } = useDisableConfig();
    // const selectedData = inputData[0];

    const [formData, setFormData] = useState({
        members: {},
    });

    const [selectedInterfaces, setSelectedInterfaces] = useState([]);
    const [interfaceNames, setInterfaceNames] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);

        // setDisableConfig(true);
        // onSubmit(dataToSubmit);
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
        // setFormData((prevFormData) => ({
        //     ...prevFormData,
        //     members: selectedInterfaces.join(", "),
        // }));

        // console.log("setFormData", inputData[0]);\

        setInterfaceNames([]);
        getInterfaces();
        getPortchannel();
    }, []);

    console.log("InterfaceNames", interfaceNames);

    return (
        <form onSubmit={handleSubmit}>
            <select
                id="memberDropdown"
                // onChange={handleDropdownChange}
                // value={member}
            >
                <option value="" disabled>
                    Select Member Interface
                </option>
                {interfaceNames.map((val, index) => (
                    <option key={index} value={val}>
                        {val}
                    </option>
                ))}
            </select>

            <div className="">
                <button
                    type="submit"
                    className="btnStyle mr-10"
                    // disabled={disableConfig}
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
