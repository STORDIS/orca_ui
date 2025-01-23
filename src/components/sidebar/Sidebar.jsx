import "./sidebar.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/orca.png";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { VscJson } from "react-icons/vsc";
import { FaGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa6";
import { useAuth } from "../../utils/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <img src={logo} className="logo" alt="logo.png" />
        </Link>
      </div>

      <div className="center">
        <Link className="navLink" to="/home">
          <FaList className="icon" />
          <span>Devices</span>
        </Link>
        <Link className="navLink" to="/ORCAsk">
          <FaRobot className="icon" />
          <span>ORCAsk</span>
        </Link>
        <Link className="navLink" to="/setup">
          <FaGear className="icon" />
          <span>SONiC Setup</span>
        </Link>
        <Link className="navLink" to="/ztpndhcp">
          <VscJson className="icon" />
          <span>ZTP & DHCP</span>
        </Link>
        <Link className="navLink" to="/ipam">
          <FaGlobe className="icon" />
          <span>IPAM</span>
        </Link>
        <Link className="navLink" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
