import "./sidebar.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/orca.png";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { FaList  } from "react-icons/fa";

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/home" style={{ textDecoration: "none" }}>
                    <img src={logo} className="logo" alt="logo.png" />
                </Link>
            </div>
            <hr />
            <div className="center">
                <Link className="navLink" to="/home">
                    <FaList  className="icon" />
                    <span>Devices</span>
                </Link>
                <Link className="navLink" to="/ORCAsk">
                    <FaRobot  className="icon" />
                    <span>ORCAsk</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
