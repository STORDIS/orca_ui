import React, { useEffect, useState } from "react";
import "../Form.scss";
import interceptor from "../../../utils/interceptor";
import { isValidIPv4WithMac } from "../../../utils/common";
import {
    subInterfaceURL,
    getAllInterfacesOfDeviceURL,
} from "../../../utils/backend_rest_urls";
import useStoreConfig from "../../../utils/configStore";
import useStoreLogs from "../../../utils/store";

const PrimarySecondaryForm = ({
    onSubmit,
    selectedDeviceIp,
    inputData,
    onClose,
}) => {
    const instance = interceptor();
    const [formData, setFormData] = useState([
        {
            name: "",
            mgt_ip: "",
            ip_address: "",
            secondary: false,
        },
        {
            name: "",
            mgt_ip: "",
            ip_address: "",
            secondary: true,
        },
    ]);

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    inputData = JSON.parse(inputData);

    useEffect(() => {
        console.log(inputData);

        if (inputData?.ip_address?.length > 0) {
            setFormData([
                {
                    name: inputData?.ip_address[0]?.name,
                    mgt_ip: selectedDeviceIp,
                    ip_address: inputData?.ip_address[0]?.ip_address,
                    secondary: inputData?.ip_address[0]?.secondary,
                },
                {
                    name: inputData?.ip_address[1]?.name,
                    mgt_ip: selectedDeviceIp,
                    ip_address: inputData?.ip_address[1]?.ip_address,
                    secondary: inputData?.ip_address[1]?.secondary,
                },
            ]);
        }
    }, []);

    const handleChangeChekbox = (e, index) => {
        if (e.target.checked && index === 0) {
            setFormData((prevFormData) => {
                const newFormData = [...prevFormData];
                newFormData[index].secondary = true;
                newFormData[1].secondary = false;
                return newFormData;
            });
        } else {
            setFormData((prevFormData) => {
                const newFormData = [...prevFormData];
                newFormData[index].secondary = true;
                newFormData[0].secondary = false;
                return newFormData;
            });
        }
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            const newFormData = [...prevFormData];
            newFormData[index][name] = value;
            return newFormData;
        });
    };

    const handleSubmit = () => {
        if (
            !isValidIPv4WithMac(formData[0].ip_address) &&
            !isValidIPv4WithMac(formData[1].ip_address)
        ) {
            alert("ip_address is not valid");
            return;
        } else {
            formData.map((item) => {
                item.mgt_ip = selectedDeviceIp;
                item.name = inputData.name;
            });
            console.log(formData);

            putConfig(formData);
        }
    };

    const deleteIpAddress = () => {
        setUpdateConfig(true);
        let payload = {
            mgt_ip: selectedDeviceIp,
            name: inputData.name,
            ip_address: inputData.ip_address,
        };

        const apiMUrl = subInterfaceURL();
        instance
            .delete(apiMUrl, { data: payload })
            .then((response) => {})
            .catch((err) => {})
            .finally(() => {
                setUpdateLog(true);
                setUpdateConfig(false);
                onClose();
            });
    };

    const putConfig = (payload) => {
        setUpdateConfig(true);

        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        instance
            .put(apiUrl, payload)
            .then((res) => {})
            .catch((err) => {})
            .finally(() => {
                setUpdateLog(true);
                setUpdateConfig(false);
                onSubmit()
            });
    };

    return (
        <div>
            <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-60 ml-25">
                    <label htmlFor="">IP Address</label>
                </div>

                <div className="form-field w-40  ml-25">
                    <label htmlFor=""></label>
                </div>
            </div>

            <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-60">
                    <input
                        type="text"
                        className="form-control"
                        name="ip_address"
                        value={formData[0].ip_address}
                        onChange={(e) => handleChange(e, 0)}
                        disabled={updateConfig}
                    />
                </div>

                <div className="form-field w-40  ">
                    <div>
                        <input
                            type="checkbox"
                            className="ml-10 mr-10"
                            checked={formData[0].secondary}
                            onChange={(e) => handleChangeChekbox(e, 0)}
                        />
                        <label htmlFor="">Secondary</label>
                    </div>
                </div>
            </div>
            <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-60">
                    <input
                        type="text"
                        className="form-control"
                        onChange={(e) => handleChange(e, 1)}
                        name="ip_address"
                        value={formData[1].ip_address}
                        disabled={updateConfig}
                    />
                </div>

                <div className="form-field w-40  ">
                    <div>
                        <input
                            type="checkbox"
                            className="ml-10 mr-10"
                            checked={formData[1].secondary}
                            onChange={(e) => handleChangeChekbox(e, 1)}
                        />
                        <label htmlFor="">Secondary</label>
                    </div>
                </div>
            </div>

            <div className="">
                <button
                    type="button"
                    className="btnStyle mr-10"
                    onClick={handleSubmit}
                    disabled={updateConfig}
                >
                    Apply Config
                </button>
                <button
                    type="button"
                    className="btnStyle mr-10"
                    onClick={deleteIpAddress}
                    disabled={updateConfig}
                >
                    Remove
                </button>
                <button type="button" className="btnStyle" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PrimarySecondaryForm;
