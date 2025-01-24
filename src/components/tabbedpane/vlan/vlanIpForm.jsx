import React, { useEffect, useState } from "react";
import interceptor from "../../../utils/interceptor";
import useStoreConfig from "../../../utils/configStore";
import useStoreLogs from "../../../utils/store";
import { removeVlanIp } from "../../../utils/backend_rest_urls";
import { getIpAvailableCommon } from "../../../pages/IPAM/IPAM";

const VlanIpForm = ({ onClose, onSubmit, selectedDeviceIp, inputData }) => {
  const instance = interceptor();
  const [ipAvailable, setIpAvailable] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const [ipPrefix, setIpPrefix] = useState(1);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  useEffect(() => {
    if (inputData?.ip_address) {
      setIpAddress(inputData.ip_address.split("/")[0]);
      setIpPrefix(inputData.ip_address.split("/")[1]);
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
  const handleSubmit = () => {

    if(ipAddress === "" || ipPrefix === "") {
      alert("ip_address or prefix is not valid");
      return;
    }
    if(ipPrefix < 1 || ipPrefix > 32) {
      alert("prefix is not valid");
      return;
    }

    onSubmit({
      ip_address: ipAddress + "/" + ipPrefix,
      vlanid: inputData.vlanid,
      name: inputData.name,
      mgt_ip: selectedDeviceIp,
    });
    setUpdateConfig(true);
  };

  const handleRemove = () => {
    let payload = {
      mgt_ip: selectedDeviceIp,
      name: inputData.name,
      vlanid: inputData.vlanid,
      ip_address: inputData.ip_address,
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

export default VlanIpForm;
