import React, { useEffect, useState } from "react";

import interceptor from "../../../utils/interceptor";
import useStoreConfig from "../../../utils/configStore";
import { isValidIPv4WithCIDR } from "../../../utils/common";

const BgpForm = ({ onSubmit, selectedDeviceIp, onClose }) => {
  const instance = interceptor();
  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);

  const [formData, setFormData] = useState({
    mgt_ip: selectedDeviceIp || "",
    vrf_name: "default",
    local_asn: 1,
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
    if (
      !isValidIPv4WithCIDR(formData.router_id) &&
      formData.router_id !== "" &&
      formData.router_id !== undefined
    ) {
      alert("router_id is not valid");
      return;
    }

    setUpdateConfig(true);
    onSubmit(formData);
  };

  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formData);
        }}
        className="form-container"
      >
        <div className="form-field">
          <label>Device IP:</label>
          <span>{selectedDeviceIp}</span>
        </div>

        <div className="form-field">
          <label htmlFor="lag-name"> Router Id :</label>
          <input
            type="text"
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
            min={1}
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
            disabled={updateConfig}
          >
            Apply Config
          </button>
          <button type="button" className="btnStyle mr-10" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BgpForm;
