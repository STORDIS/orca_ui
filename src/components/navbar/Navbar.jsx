import "./navbar.scss";
import { FaSearch } from "react-icons/fa";
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
import CredentialForm from "../../pages/ZTPnDHCP/CredentialsForm";

const Navbar = () => {
  const auth = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [sshData, setSshData] = useState(false);
  const [orcaDeviceData, setOrcaDeviceData] = useState({
    availableDevices: [],
    notAvailableDevices: [],
    totalDevices: 0,
  });

  const instance = interceptor();
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

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
    getDevices();
  }, []);

  const getDevices = () => {
    instance(getAllDevicesURL())
      .then((res) => {
        console.log(res.data);

        let availableDevices = [];
        let notAvailableDevices = [];

        res.data.forEach((element) => {
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

        // system_status
        // mgt_ip

        setOrcaDeviceData({
          availableDevices: availableDevices,
          notAvailableDevices: notAvailableDevices,
          totalDevices: res.data.length,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <FaSearch />
        </div>

        <div className="items">
          <div className="mr-5">
            <div>Total Devices: {orcaDeviceData.totalDevices}</div>
            <div>
              Available Devices:
              {orcaDeviceData.availableDevices.length}
            </div>
          </div>
          <CredentialForm
            type="pointer"
            sendCredentialsToParent={(e) => {
              setSshData(e);
            }}
          />

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
