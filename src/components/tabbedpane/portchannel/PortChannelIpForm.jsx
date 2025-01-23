import React, { useEffect, useState } from "react";
import interceptor from "../../../utils/interceptor";

import useStoreConfig from "../../../utils/configStore";

import useStoreLogs from "../../../utils/store";

import { getIpAvailableCommon } from "../../../pages/IPAM/IPAM";
import { deletePortchannelIpURL } from "../../../utils/backend_rest_urls";

const PortChannelIpForm = ({
  onClose,
  onSubmit,
  selectedDeviceIp,
  inputData,
}) => {
  const instance = interceptor();
  const [ipAvailable, setIpAvailable] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const [ipPrefix, setIpPrefix] = useState(1);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  useEffect(() => {
    console.log(inputData?.ip_address);

    if (inputData?.ip_address) {
      let ip = inputData?.ip_address?.split("/");
      setIpAddress(ip[0]);
      setIpPrefix(ip[1]);
    }

    getIpAvailableCommon().then((res) => {
      setIpAvailable(res);
    });
  }, []);

  const handleIpChange = (e) => {
    setIpAddress(e.target.value);
  };

  const handleIpPrefixChange = (e) => {
    setIpPrefix(e.target.value);
  };

  const handleSubmit = (e) => {
    console.log(ipAddress + "/" + ipPrefix);
    onSubmit([
      {
        ip_address: ipAddress + "/" + ipPrefix,
        lag_name: inputData.lag_name,
      },
    ]);
  };

  const handleRemove = (e) => {
    setUpdateConfig(true);
    const apiMUrl = deletePortchannelIpURL();
    instance
      .delete(apiMUrl, {
        data: {
          mgt_ip: selectedDeviceIp,
          lag_name: inputData.lag_name,
        },
      })
      .then((response) => {})
      .catch((err) => {})
      .finally(() => {
        setUpdateLog(true);
        setUpdateConfig(false);
        onClose();
      });
  };

  return (
    <div>
      <div className="form-wrapper">
        <div className="form-field w-25">
          <label htmlFor="">IP Address :</label>
        </div>
        <div className="form-field w-50">
          <select
            name="ip_address"
            id=""
            className="form-control"
            onChange={handleIpChange}
            value={ipAddress}
            defaultValue={ipAddress}
          >
            {ipAddress && <option value={ipAddress}>{ipAddress}</option>}
            {!ipAddress && (
              <option value="" disabled>
                Select IP Address
              </option>
            )}

            {ipAvailable.map((ip) => (
              <option key={ip} value={ip}>
                {ip}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field w-15">
          <input
            type="number"
            name="prefix"
            id=""
            className="form-control"
            value={ipPrefix}
            onChange={handleIpPrefixChange}
          />
        </div>
      </div>

      <div>
        <button className="btnStyle" onClick={handleSubmit}>
          Apply Config
        </button>
        <button className="btnStyle ml-15" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default PortChannelIpForm;
