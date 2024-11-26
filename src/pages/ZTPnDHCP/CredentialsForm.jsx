import React, { useRef, useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { dhcpCredentialsURL } from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor";
import Tooltip from "@mui/material/Tooltip";

export const CredentialForm = ({ sendCredentialsToParent }) => {
  const instance = interceptor();
  const [configStatus, setConfigStatus] = useState("");

  const [formData, setFormData] = useState({
    device_ip: "",
    username: "",
    password: "",
    ssh_access: false,
  });

  useEffect(() => {
    getCredentials();
  }, []);

  const getCredentials = () => {
    instance
      .get(dhcpCredentialsURL())
      .then((res) => {
        setFormData(res.data);
        sendCredentialsToParent(res.data.device_ip);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setConfigStatus("Config Success");
        setTimeout(() => {
          setConfigStatus("");
        }, 2500);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const putCredentials = (payload) => {
    setConfigStatus("Config In Progress....");
    instance
      .put(dhcpCredentialsURL(), payload)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setConfigStatus("");
      })
      .finally(() => {
        setConfigStatus("");
        getCredentials();
      });
  };

  return (
    <div className="listContainer">
      <div className="form-wrapper" style={{ alignItems: "center" }}>
        <div className="form-field w-25">
          <Tooltip placement="top" title="tool tip here">
            <label htmlFor=""> Server IP :</label>
          </Tooltip>

          <input
            type="text"
            placementholder=""
            onChange={handleChange}
            name="device_ip"
            value={formData.device_ip}
          />
        </div>
        <div className="form-field w-25">
          <Tooltip placement="top" title="tool tip here">
            <label htmlFor=""> SSH User Name :</label>
          </Tooltip>

          <input
            type="text"
            placementholder=""
            onChange={handleChange}
            name="username"
            value={formData.username}
          />
        </div>
        <div className="form-field w-25">
          <Tooltip placement="top" title="tool tip here">
            <label htmlFor=""> SSH Password :</label>
          </Tooltip>
          <input
            type="password"
            placementholder=""
            onChange={handleChange}
            name="password"
            value={formData.password}
            disabled={formData.ssh_access}
          />
        </div>
        <div className="form-field w-25">
          <span
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Tooltip placement="top" title="tool tip here">
              SSH Connection :
              <FaCircle
                className={`ml-5 ${
                  formData.ssh_access === formData.ssh_access
                    ? "success"
                    : "danger"
                }`}
              />
            </Tooltip>
          </span>
        </div>
      </div>

      <div className="form-wrapper">
        <button onClick={() => putCredentials(formData)} className="btnStyle">
          Apply Config
        </button>
        <span className="configStatus">{configStatus}</span>
      </div>
    </div>
  );
};

export default CredentialForm;
