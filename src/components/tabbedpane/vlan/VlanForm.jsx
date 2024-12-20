import React, { useEffect, useState, useRef } from "react";
import interceptor from "../../../utils/interceptor";
import useStoreConfig from "../../../utils/configStore";
import { getInterfaceDataCommon } from "../interfaces/interfaceDataTable";
import { getPortChannelDataCommon } from "../portchannel/portChDataTable";
import { areAllIPAddressesValid } from "../../../utils/common";
import { isValidIPv4WithMac } from "../../../utils/common";

const VlanForm = ({ onSubmit, selectedDeviceIp, onClose }) => {
  const instance = interceptor();
  const [selectedInterfaces, setSelectedInterfaces] = useState({});
  const [interfaceNames, setInterfaceNames] = useState([]);
  const [disabledIp, setDisabledIp] = useState(false);
  const [disabledSagIp, setDisabledSagIp] = useState(false);

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);

  const selectRefVlanMembers = useRef(null);

  const [formData, setFormData] = useState({
    mgt_ip: selectedDeviceIp || "",
    name: "Vlan1",
    vlanid: 1,
    mtu: 9000,
    enabled: false,
    description: undefined,
    ip_address: undefined,
    sag_ip_address: undefined,
    autostate: undefined,
    mem_ifs: undefined,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "vlanid") {
      const vlanName = `Vlan${value}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        vlanid: value,
        name: vlanName,
      }));
    } else if (name === "enabled") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value === "true" ? true : false,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (name === "ip_address" && value) {
      setDisabledSagIp(true);
    } else if (name === "sag_ip_address" && value) {
      setDisabledIp(true);
    } else {
      setDisabledIp(false);
      setDisabledSagIp(false);
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    const vlanid = parseFloat(formData.vlanid);
    if (vlanid < 0) {
      alert("VLAN ID cannot be Negative.");
      return;
    }
    if (
      !isValidIPv4WithMac(formData.ip_address) &&
      formData.ip_address !== ""
    ) {
      alert("ip_address is not valid");
      return;
    }
    if (
      !areAllIPAddressesValid(formData.sag_ip_address) &&
      formData.sag_ip_address !== ""
    ) {
      alert("sag_ip_address is not valid");
      return;
    }
    if (formData.sag_ip_address && formData.ip_address) {
      alert("ip_address or sag_ip_address any one must be added");
      return;
    }
    if (formData?.sag_ip_address) {
      let trimmedIpAddresses = formData.sag_ip_address
        .split(",")
        .map((ip) => ip.trim());
      formData.sag_ip_address = trimmedIpAddresses;
    }

    let dataToSubmit = {
      ...formData,
      vlanid,
    };

    if (formData.sag_ip_address) {
      let trimmedIpAddresses = formData.sag_ip_address
        .split(",")
        .map((ip) => ip.trim());

      dataToSubmit.sag_ip_address = trimmedIpAddresses;
    }

    if (Object.keys(selectedInterfaces).length > 0) {
      dataToSubmit.mem_ifs = selectedInterfaces;
    }

    setUpdateConfig(true);
    onSubmit(dataToSubmit);
  };

  useEffect(() => {
    setInterfaceNames([]);

    getInterfaceDataCommon(selectedDeviceIp).then((eth_Data) => {
      const ethernetInterfaces = eth_Data
        .filter((element) => element.name.includes("Ethernet"))
        .map((element) => element.name);
      getPortChannelDataCommon(selectedDeviceIp).then((port_data) => {
        const portchannel = port_data.map((element) => element.lag_name);
        setInterfaceNames([...portchannel, ...ethernetInterfaces]);
      });
    });
  }, []);

  const handleDropdownChange = (event) => {
    let newValue = event.target.value;

    setSelectedInterfaces((prev) => ({
      ...prev,
      [event.target.value]: "ACCESS",
    }));

    setInterfaceNames((prev) => prev.filter((item) => item !== newValue));
    setTimeout(() => (selectRefVlanMembers.current.value = "DEFAULT"), 100);
  };

  const handleCheckbox = (key, value) => {
    setSelectedInterfaces((prevInterfaces) => ({
      ...prevInterfaces,
      [key]: value === "TRUNK" ? "ACCESS" : "TRUNK",
    }));
  };

  const handleRemove = (key) => {
    setSelectedInterfaces((prevInterfaces) => {
      const newInterfaces = { ...prevInterfaces };
      delete newInterfaces[key];
      return newInterfaces;
    });

    setInterfaceNames((prev) => {
      const exist = prev.some((item) => item === key);
      if (!exist) {
        return [...prev, key];
      }
      return prev;
    });
  };

  return (
    <div>
      <div className="form-wrapper">
        <div className="form-field w-50">
          <label>Device IP:</label>
          <input type="text" value={selectedDeviceIp} disabled />
        </div>

        <div className="form-field w-50">
          <label>MTU:</label>
          <input
            type="number"
            name="mtu"
            value={formData.mtu}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-wrapper">
        <div className="form-field w-50">
          <label>VLAN_ID:</label>
          <input
            type="number"
            name="vlanid"
            value={formData.vlanid}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-field w-50">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled
          />
        </div>
      </div>

      <div className="form-wrapper">
        <div className="form-field w-50">
          <label>Autostate </label>
          <select
            name="autostate"
            value={formData.enabled}
            onChange={handleChange}
          >
            <option value="enable">Enable</option>
            <option value="disable">Disable</option>
          </select>
        </div>

        <div className="form-field w-50">
          <label> Admin Status:</label>
          <select
            name="enabled"
            value={formData.enabled}
            onChange={handleChange}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      </div>

      <div className="form-wrapper">
        <div className="form-field w-50">
          <label> IP address</label>
          <input
            disabled={disabledIp}
            type="text"
            name="ip_address"
            value={formData.ip_address}
            onChange={handleChange}
          />
        </div>

        <div className="form-field w-50">
          <label>Anycast Address</label>
          <input
            disabled={disabledSagIp}
            type="text"
            name="sag_ip_address"
            value={formData.sag_ip_address}
            onChange={handleChange}
          />
          <small>
            Note : Use (,) Comma to separate the multiple IP address
          </small>
        </div>
      </div>

      <div className="form-wrapper">
        <div className="form-field w-75">
          <label>Select Member Interface </label>
          <select
            onChange={handleDropdownChange}
            ref={selectRefVlanMembers}
            defaultValue={"DEFAULT"}
          >
            <option value="DEFAULT" disabled>
              Select Member Interface
            </option>
            {interfaceNames.map((val, index) => (
              <option key={index} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field mt-25">
          {Object.keys(selectedInterfaces).length} selected
        </div>
      </div>

      <div className="selected-interface-wrap mb-10 w-100">
        {Object.entries(selectedInterfaces).map(([key, value], index) => (
          <div key={key} className="selected-interface-list mb-10">
            <div className="ml-10 w-50">
              {index + 1} &nbsp; {key}
            </div>
            <div className=" w-50">
              <input
                type="checkbox"
                checked={value === "TRUNK"}
                onChange={() => handleCheckbox(key, value)}
              />
              <span className="ml-10">Tagged</span>

              <button
                className="btnStyle ml-25"
                onClick={() => handleRemove(key)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="form-field">
        <label>Description</label>
        <textarea
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>

      <div className="">
        <button
          type="submit"
          className="btnStyle mr-10"
          disabled={updateConfig}
          onClick={handelSubmit}
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

export default VlanForm;
