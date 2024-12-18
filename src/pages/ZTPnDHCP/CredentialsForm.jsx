import React, { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { dhcpCredentialsURL } from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { isValidIPv4WithCIDR } from "../../utils/common";
import useStoreLogs from "../../utils/store";
import useStorePointer from "../../utils/pointerStore";

export const getDhcpCredentialsCommon = () => {
  const instance = interceptor();
  const apiUrl = dhcpCredentialsURL();

  return instance
    .get(apiUrl)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return []; // Return an empty array on error
    });
};

export const CredentialForm = ({ type, sendCredentialsToParent }) => {
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  const instance = interceptor();
  const [configStatus, setConfigStatus] = useState("");

  const [formData, setFormData] = useState({
    device_ip: "",
    username: "",
    password: "",
    ssh_access: undefined,
  });

  const setUpdateStorePointer = useStorePointer(
    (state) => state.setUpdateStorePointer
  );

  const CustomToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: 15,
    },
  }));

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    getCredentials();
  }, []);

  const getCredentials = () => {
    getDhcpCredentialsCommon()
      .then((res) => {
        setFormData(res);
        sendCredentialsToParent(res);
      })
      .catch((err) => {
        console.error(err);
        setIsDisabled(false);
      })
      .finally(() => {
        setIsDisabled(false);
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
    setIsDisabled(true);
    if (payload.device_ip === "" || payload.username === "") {
      alert("Please fill all the fields");
      setIsDisabled(false);
      return;
    }
    if (!isValidIPv4WithCIDR(payload.device_ip)) {
      alert("Invalid IP Address");
      setIsDisabled(false);
      return;
    }
    setConfigStatus("Config In Progress....");
    instance
      .put(dhcpCredentialsURL(), payload)
      .then((res) => {
        setConfigStatus("Config Success");
      })
      .catch((err) => {
        console.error(err);
        setConfigStatus("Config Failed");
      })
      .finally(() => {
        setUpdateLog(true);
        getCredentials();
        setUpdateStorePointer();
      });
  };

  const removeCredentials = (payload) => {
    setIsDisabled(true);
    setConfigStatus("Config In Progress....");
    instance
      .delete(dhcpCredentialsURL(), { data: { device_ip: payload.device_ip } })
      .then((res) => {})
      .catch((err) => {
        console.error(err);
        setConfigStatus("");
        setIsDisabled(false);
      })
      .finally(() => {
        setFormData({
          device_ip: "",
          username: "",
          password: "",
          ssh_access: undefined,
        });
        setIsDisabled(false);
        setConfigStatus("");
        getCredentials();
        setUpdateLog(true);
        setUpdateStorePointer();
      });
  };

  return (
    <>
      {type === "form" ? (
        <div className="listContainer">
          <div className="listTitle mb-15">DHCP Server Credentials</div>

          <div className="form-wrapper" style={{ alignItems: "center" }}>
            <div className="form-field w-25">
              <CustomToolTip
                arrow
                placement="top"
                title="Provide Server IP for SSH connection"
              >
                <label htmlFor=""> Server IP :</label>
              </CustomToolTip>

              <input
                type="text"
                placeholder=""
                onChange={handleChange}
                name="device_ip"
                value={formData?.device_ip}
                disabled={isDisabled}
              />
            </div>
            <div className="form-field w-25">
              <CustomToolTip
                arrow
                placement="top"
                title="Provide SSH User Name"
              >
                <label htmlFor=""> SSH User Name :</label>
              </CustomToolTip>

              <input
                type="text"
                placeholder=""
                onChange={handleChange}
                name="username"
                value={formData?.username}
                disabled={isDisabled}
              />
            </div>
            <div className="form-field w-25">
              <CustomToolTip arrow placement="top" title="Provide SSH Password">
                <label htmlFor=""> SSH Password :</label>
              </CustomToolTip>
              <input
                type="password"
                placeholder=""
                onChange={handleChange}
                name="password"
                value={formData?.password}
                disabled={isDisabled}
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
                SSH Connection :
                <CustomToolTip
                  arrow
                  placement="top"
                  title={
                    formData?.ssh_access === true
                      ? "Connection to SSH is successful"
                      : formData?.ssh_access === false
                      ? "Connection to SSH failed"
                      : "No connection"
                  }
                >
                  <div>
                    <FaCircle
                      className={`ml-5 ${
                        formData?.ssh_access === true
                          ? "success"
                          : formData?.ssh_access === false
                          ? "danger"
                          : ""
                      }`}
                      style={{ fontSize: "25px" }}
                    />
                  </div>
                </CustomToolTip>
              </span>
            </div>
          </div>

          <div
            className="form-wrapper"
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              <button
                onClick={() => putCredentials(formData)}
                className="btnStyle"
              >
                Apply Config
              </button>
              <span className="configStatus">{configStatus}</span>
            </div>
            <button
              onClick={() => removeCredentials(formData)}
              className="btnStyle"
            >
              Remove DHCP Server
            </button>
          </div>
        </div>
      ) : type === "status" ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          DHCP server {formData?.device_ip} connection status :
          <CustomToolTip
            arrow
            placement="top"
            title={
              formData?.ssh_access === true
                ? "Connection to SSH is successful"
                : formData?.ssh_access === false
                ? "Connection to SSH failed"
                : "No connection"
            }
          >
            <div>
              <FaCircle
                className={`ml-5 ${
                  formData?.ssh_access === true
                    ? "success"
                    : formData?.ssh_access === false
                    ? "danger"
                    : ""
                }`}
                style={{ fontSize: "25px" }}
              />
            </div>
          </CustomToolTip>
        </div>
      ) : null}
    </>
  );
};

export default CredentialForm;
