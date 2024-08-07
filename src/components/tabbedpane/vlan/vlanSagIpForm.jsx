import React, { useEffect, useState } from "react";
import "../Form.scss";
import { useDisableConfig } from "../../../utils/dissableConfigContext";
import { useLog } from "../../../utils/logpannelContext";
import interceptor from "../../../utils/interceptor";
import { isValidIPv4WithMac } from "./VlanForm";
import { getVlansURL, removeVlanIp } from "../../../utils/backend_rest_urls";

const VlanSagIpForm = ({ onSubmit, selectedDeviceIp, inputData, onClose }) => {
    const instance = interceptor();
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();
    const [newSagIp, setNewSagIp] = useState("");

    const handleRemove = (e) => {
        let payload = {
            mgt_ip: selectedDeviceIp,
            name: inputData.name,
            sag_ip_address: [e],
        };

        setDisableConfig(true);
        const apiMUrl = removeVlanIp();
        instance
            .delete(apiMUrl, { data: payload })
            .then((response) => {})
            .catch((err) => {})
            .finally(() => {
                setLog(true);
                setDisableConfig(false);
                onSubmit();
                setLog(true);
            });
    };

    const handleChange = (e) => {
        setNewSagIp(e.target.value);
    };

    const addSagIptoArray = () => {
        if (!isValidIPv4WithMac(newSagIp)) {
            alert("ip_address is not valid");
            setNewSagIp("");
            return;
        } else {
            let payload = {
                mgt_ip: selectedDeviceIp,
                name: inputData.name,
                sag_ip_address: [newSagIp],
            };

            setDisableConfig(true);

            const apiMUrl = getVlansURL(selectedDeviceIp);
            instance
                .put(apiMUrl, payload)
                .then(() => {})
                .catch(() => {})
                .finally(() => {
                    setLog(true);
                    setDisableConfig(false);
                    setNewSagIp("");
                    onSubmit();
                });
        }
    };

    return (
        <div>
            <div className="form-wrapper">
                <div className="form-field w-75">
                    <label>SAG IP Address</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={handleChange}
                        value={newSagIp}
                        disabled={disableConfig}
                    />
                </div>

                <div style={{ marginTop: "22px" }} className="form-field w-25 ">
                    <button
                        type="button"
                        className="btnStyle"
                        onClick={addSagIptoArray}
                    >
                        Add
                    </button>
                </div>
            </div>
            <div className="selected-interface-wrap mb-10 w-100">
                {inputData.sag_ip_address && inputData.sag_ip_address.length > 0
                    ? inputData.sag_ip_address.map((ip, index) => (
                          <div className="selected-interface-list mb-10">
                              <div className="ml-10 mr-10 w-75">
                                  {index + 1} &nbsp; {ip}
                              </div>
                              <div className=" w-25">
                                  <button
                                      className="btnStyle ml-25 mr-25"
                                      disabled={disableConfig}
                                      onClick={() => handleRemove(ip)}
                                  >
                                      Remove
                                  </button>
                              </div>
                          </div>
                      ))
                    : null}
            </div>

            <div className="">
                <button type="button" className="btnStyle" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default VlanSagIpForm;
