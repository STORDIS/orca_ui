import "./navbar.scss";
import { FaSearch, FaCircle } from "react-icons/fa";
import { useAuth } from "../../utils/auth";
import React, { useState, useEffect } from "react";
import {
  getDiscoveryUrl,
  getAllDevicesURL,
} from "../../utils/backend_rest_urls";
import DiscoveryForm from "./DiscoveryForm";
import Modal from "../modal/Modal";
import interceptor from "../../utils/interceptor";
import { getIsStaff } from "../../utils/common";
import useStoreLogs from "../../utils/store";
import { getLogsCommon } from "../../components/logpane/logpane";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { getDhcpCredentialsCommon } from "../../pages/ZTPnDHCP/CredentialsForm";
import { getDevicesCommon } from "../../pages/home/Home";
import Time from "react-time-format";

const Navbar = () => {
  const auth = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [orcaDeviceData, setOrcaDeviceData] = useState({
    availableDevices: [],
    notAvailableDevices: [],
    totalDevices: 0,
  });
  const [credentials, setCredentials] = useState({
    device_ip: "",
    ssh_access: undefined,
  });

  const [ongoingProcess, setOngoingProcess] = useState({
    started: 0,
    pending: 0,
  });

  const instance = interceptor();
  const updateLog = useStoreLogs((state) => state.updateLog);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  const [dhcpDevices, setDhcpDevices] = useState({
    totalDevices: 0,
    lastScanned: undefined,
  });

  const start_discovery = async (formData) => {
    try {
      setShowForm(false);
      const response = await instance.put(getDiscoveryUrl(), formData);
      setUpdateLog(true);
    } catch (error) {
      console.error(error);
      setUpdateLog(true);
    }
  };

  const handleLogout = () => {
    auth.logout();
  };

  useEffect(() => {
    getAllPointers();
  }, []);

  useEffect(() => {
      getAllPointers();
    
  }, [updateLog]);

  const getAllPointers = () => {
    getDevicesCommon().then((res) => {
      let availableDevices = [];
      let notAvailableDevices = [];

      res.forEach((element) => {
        if (element.system_status === "System is ready") {
          availableDevices.push({
            mgt_ip: element.mgt_ip,
            system_status: element.system_status,
          });
        } else {
          notAvailableDevices.push({
            mgt_ip: element.mgt_ip,
            system_status: element.system_status,
          });
        }
      });

      setOrcaDeviceData({
        availableDevices: availableDevices,
        notAvailableDevices: notAvailableDevices,
        totalDevices: res.length,
      });
    });

    getLogsCommon().then((res) => {
      let started = 0;
      let pending = 0;
      for (const element of res) {
        if (element.status === "STARTED") {
          started = started + 1;
        } else if (element.status === "PENDING") {
          pending = pending + 1;
        }
      }

      setOngoingProcess({
        started: started,
        pending: pending,
      });

      for (const element of res) {
        if (element.http_path === "/files/dhcp/scan") {
          setDhcpDevices({
            totalDevices: element.response.sonic_devices.length,
            lastScanned: element.timestamp,
          });
          break;
        }
      }
    });

    getDhcpCredentialsCommon().then((res) => {
      setCredentials({
        device_ip: res.device_ip,
        ssh_access: res.ssh_access,
      });
    });
  };

  const CustomToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: 15,
    },
  }));

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <FaSearch />
        </div>

        <div className="items">
          <div className="mr-10 border-right">
            <div>Task Started: {ongoingProcess.started}</div>
            <div>Task Pending: {ongoingProcess.pending}</div>
          </div>

          <div className="mr-10 border-right">
            <div>Total Devices: {orcaDeviceData.totalDevices}</div>
            <div>
              Available Devices:
              {orcaDeviceData.availableDevices.length}
            </div>
          </div>

          <div className="mr-10 border-right">
            <div>Devices Avilable in Network: {dhcpDevices.totalDevices}</div>
            <div>
              Last scan:
              {dhcpDevices.lastScanned === undefined ? (
                " Unknown"
              ) : (
                <Time
                  className="ml-5 mr-5"
                  value={dhcpDevices.lastScanned}
                  format="hh:mm:ss DD-MM-YYYY"
                />
              )}
            </div>
          </div>

          <CustomToolTip
            arrow
            placement="top"
            title={
              credentials?.ssh_access === true
                ? "Connection to SSH " +
                  credentials?.device_ip +
                  " is successful"
                : credentials?.ssh_access === false
                ? "Connection to SSH " + credentials?.device_ip + " failed"
                : "No connection"
            }
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              DHCP connection :
              <FaCircle
                className={`ml-5 ${
                  credentials?.ssh_access === true
                    ? "success"
                    : credentials?.ssh_access === false
                    ? "danger"
                    : ""
                }`}
                style={{ fontSize: "25px" }}
              />
            </div>
          </CustomToolTip>

          <div>
            <button
              className="btnStyle ml-10 mr-10"
              id="discoveryBtn"
              onClick={() => setShowForm(true)}
              disabled={!getIsStaff()}
            >
              Discover Networks
            </button>

            <Modal
              show={showForm}
              onClose={() => setShowForm(false)}
              title="Discover Devices"
            >
              <DiscoveryForm handleSubmit={start_discovery} />
            </Modal>

            <button id="logoutBtn" onClick={handleLogout} className="btnStyle">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
