import React, { useEffect, useState } from "react";
import "../Form.scss";
import interceptor from "../../../utils/interceptor";
import { isValidIPv4WithMac } from "../../../utils/common";
import { getVlansURL, removeVlanIp } from "../../../utils/backend_rest_urls";
import useStoreConfig from "../../../utils/configStore";
import useStoreLogs from "../../../utils/store";

const VlanSagIpForm = ({ onSubmit, selectedDeviceIp, inputData, onClose }) => {
    const instance = interceptor();
    const [newSagIp, setNewSagIp] = useState("");

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const handleRemove = (e) => {
        let payload = {
            mgt_ip: selectedDeviceIp,
            name: inputData.name,
            sag_ip_address: [e],
        };

        setUpdateConfig(true);
        const apiMUrl = removeVlanIp();
        instance
            .delete(apiMUrl, { data: payload })
            .then((response) => {})
            .catch((err) => {})
            .finally(() => {
                setUpdateLog(true);
                setUpdateConfig(false);
                onSubmit();
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

            setUpdateConfig(true);

            const apiMUrl = getVlansURL(selectedDeviceIp);
            instance
                .put(apiMUrl, payload)
                .then(() => {})
                .catch(() => {})
                .finally(() => {
                    setUpdateLog(true);
                    setUpdateConfig(false);
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
                        disabled={updateConfig}
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
                                      disabled={updateConfig}
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
