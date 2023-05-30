import "./sidebar.scss"
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import SchemaIcon from '@mui/icons-material/Schema';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/" style={{textDecoration: "none"}}>
                <span className="logo">Stordis Network Configuration Manager</span>
                </Link>

            </div>
            <hr/>
            <div className="center">
                <ul>
                    <p className="part-1">PART-1</p>
                    <li>
                        <DashboardIcon className="icon"/>
                        <span>Dashboard</span>
                    </li>
                    <p className="part-1">PART-2</p>
                    <li>
                        <StorageIcon className="icon"/>
                        <Link to="/devices" style={{textDecoration: "none"}}>
                        <span>Devices</span>
                        </Link>
                    </li>
                    <li>
                        <SchemaIcon className="icon"/>
                        <span>Visualization</span>
                    </li>
                    <li>
                        <CorporateFareIcon className="icon"/>
                        <span>Organization</span>
                    </li>
                    <p className="part-1">PART-3</p>
                    <li>
                        <PeopleIcon className="icon"/>
                        <span>Users</span>
                    </li>
                    <li>
                        <BookIcon className="icon"/>
                        <span>Logs</span>
                    </li>
                    <li>
                        <SettingsIcon className="icon"/>
                        <span>Settings</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOptions"></div>
                <div className="colorOptions"></div>
                
            </div>
        </div>

    )
}

export default Sidebar