import React, { useEffect, useState } from "react";
import "../Form.scss";
import interceptor from "../../../utils/interceptor";
import { isValidIPv4WithMac } from "../../../utils/common";
import { getVlansURL, removeVlanIp } from "../../../utils/backend_rest_urls";
import useStoreConfig from "../../../utils/configStore";
import useStoreLogs from "../../../utils/store";

const PrimarySecondaryForm = ({
    onSubmit,
    selectedDeviceIp,
    inputData,
    onClose,
}) => {
    const instance = interceptor();
    const [ipAddress, setIpAddress] = useState({
        ip_address_1: "",
        ip_address_2: "",
    });

    const [subInterfaces, setSubInterfaces] = useState([]);

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const handleChange = (e) => {
        // setSubip(e.target.value);
    };

    const addSagIptoArray = () => {
        if (
            !isValidIPv4WithMac(ipAddress.ip_address_1) &&
            !isValidIPv4WithMac(ipAddress.ip_address_2)
        ) {
            alert("ip_address is not valid");
            // setSubip("");
            return;
        } else {
            console.log("addition payload", ipAddress);
        }
    };

    return (
        <div>
            <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-60 ml-25">
                    <label htmlFor="">IP Address</label>
                </div>

                <div className="form-field w-40  ml-25">
                    <label htmlFor="">Secondary</label>
                </div>
            </div>

            <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-60">
                    <input
                        type="text"
                        className="form-control"
                        onChange={handleChange}
                        value={ipAddress.ip_address_1}
                        disabled={updateConfig}
                    />
                </div>

                <div className="form-field w-40  ">
                    <div>
                        <input type="checkbox" className="ml-10 mr-10" />
                        <label htmlFor="">Secondary</label>
                    </div>
                </div>
            </div>
            <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-60">
                    <input
                        type="text"
                        className="form-control"
                        onChange={handleChange}
                        value={ipAddress.ip_address_2}
                        disabled={updateConfig}
                    />
                </div>

                <div className="form-field w-40  ">
                    <div>
                        <input type="checkbox" className="ml-10 mr-10" />
                        <label htmlFor="">Secondary</label>
                    </div>
                </div>
            </div>

            <div className="">
                <button
                    type="button"
                    className="btnStyle mr-10"
                    onClick={onSubmit}
                >
                    Apply Config
                </button>
                <button type="button" className="btnStyle" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PrimarySecondaryForm;
