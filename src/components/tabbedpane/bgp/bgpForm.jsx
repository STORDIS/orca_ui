import React, { useEffect, useState } from "react";
import "../Form.scss";
import interceptor from "../../../utils/interceptor";
import { useDisableConfig } from "../../../utils/dissableConfigContext";

const BgpForm = ({
    onSubmit,
    selectedDeviceIp,
    onCancel,
    handelSubmitButton,
}) => {
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const instance = interceptor();

    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || "",
        vrf_name: "default",
        local_asn: 0,
        router_id: selectedDeviceIp,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedValue = name === "local_asn" ? parseInt(value, 10) : value;
        setFormData((prevState) => ({
            ...prevState,
            [name]: updatedValue,
        }));
    };

    const handleSubmit = (e) => {
        setDisableConfig(true);
        onSubmit(formData);
    };

    return (
        <div className="">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(formData);
                }}
                className="port-channel-form"
            >
                <div className="form-field">
                    <label>Device IP:</label>
                    <span>{selectedDeviceIp}</span>
                </div>

                <div className="form-field">
                    <label htmlFor="lag-name"> Router Id :</label>
                    <input
                        type="number"
                        name="router_id"
                        value={formData.router_id}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lag-name"> Local ASN :</label>
                    <input
                        type="number"
                        name="local_asn"
                        value={formData.local_asn}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lag-name">VRF Name :</label>
                    <input
                        type="text"
                        name="vrf_name"
                        value={formData.vrf_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="">
                    <button
                        type="submit"
                        className="btnStyle mr-10"
                        disabled={disableConfig}
                    >
                        Apply Config
                    </button>
                    <button
                        type="button"
                        className="btnStyle mr-10"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BgpForm;
