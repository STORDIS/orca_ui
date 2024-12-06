import React, { useEffect, useState } from "react";

import interceptor from "../../../utils/interceptor";
import { isValidIPv4WithMac } from "../../../utils/common";
import { subInterfaceURL } from "../../../utils/backend_rest_urls";
import useStoreConfig from "../../../utils/configStore";
import useStoreLogs from "../../../utils/store";

const PrimarySecondaryForm = ({
  onSubmit,
  selectedDeviceIp,
  inputData,
  onClose,
}) => {
  const instance = interceptor();

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  const [inputDataJson, setInputDataJson] = useState(JSON.parse(inputData));

  const [formData, setFormData] = useState({
    ip_address: "",
    secondary: false,
    mgt_ip: selectedDeviceIp,
    name: inputDataJson.name,
  });

  useEffect(() => {
    if (inputDataJson?.ip_address?.length > 0) {
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      ip_address: value,
    }));
  };

  const handleChangeChekbox = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      secondary: e.target.checked,
    }));
  };

  const handleSubmit = () => {
    if (!isValidIPv4WithMac(formData.ip_address)) {
      alert("ip_address is not valid");
      return;
    } else {
      onSubmit([formData]);
    }
  };

  const deleteIpAddress = (item) => {
    setUpdateConfig(true);
    let payload = {};

    if (item !== undefined) {
      payload = {
        mgt_ip: selectedDeviceIp,
        name: inputDataJson.name,
        ip_address: item.ip_address + "/" + item.prefix,
        secondary: item.secondary,
      };
    } else {
      payload = {
        mgt_ip: selectedDeviceIp,
        name: inputDataJson.name,
      };
    }

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

  return (
    <div id="primarySecondaryForm">
      <div className="form-wrapper" style={{ alignItems: "center" }}>
        <div className="form-field w-60 ml-25">
          <label htmlFor="">IP Address</label>
        </div>

        <div className="form-field w-40  ml-25">
          <label htmlFor=""></label>
        </div>
      </div>

      <div className="form-wrapper" style={{ alignItems: "center" }}>
        <div className="form-field w-50">
          <input
            type="text"
            className="form-control"
            name="ip_address"
            value={formData.ip_address}
            onChange={(e) => handleChange(e)}
            disabled={updateConfig}
          />
        </div>

        <div className="form-field  ">
          <div>
            <input
              type="checkbox"
              className="mr-10"
              name="secondary"
              // disabled={
              //     updateConfig ||
              //     inputDataJson.ip_address === undefined
              // }
              onChange={(e) => handleChangeChekbox(e)}
            />
            <label htmlFor="">Secondary</label>
          </div>
        </div>
        <div className="form-field">
          <div>
            <button
              id="applyConfigIpBtn"
              className="btnStyle"
              disabled={updateConfig}
              onClick={handleSubmit}
            >
              Apply Config
            </button>
          </div>
        </div>
      </div>

      <div className="selected-interface-wrap mb-10 w-100">
        {inputDataJson.ip_address?.map((item, index) => (
          <div
            className="selected-interface-list mb-10"
            key={item.ip_address + "/" + item.prefix}
            id={item.ip_address + "/" + item.prefix}
          >
            <div className="w-10 pl-10">{index + 1}</div>
            <div className="w-50" id="ipAddress">
              {item.ip_address + "/" + item.prefix}
            </div>
            <div className="w-25">
              {item.secondary ? "Secondary" : "Primary"}
            </div>
            <div className="w-25">
              <button
                className="btnStyle"
                id="ipRemoveBtn"
                onClick={() => deleteIpAddress(item)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="">
        <button
          type="button"
          className="btnStyle mr-10"
          onClick={() => deleteIpAddress(undefined)}
          disabled={updateConfig}
          id="removeAllBtn"
        >
          Remove All
        </button>
        <button
          type="button"
          id="cancelBtn"
          className="btnStyle"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PrimarySecondaryForm;
