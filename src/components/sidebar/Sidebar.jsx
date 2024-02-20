import "./sidebar.scss"
import StorageIcon from '@mui/icons-material/Storage';
import { Link } from "react-router-dom";
import logo from '../../assets/orca.png'
const Sidebar = ({handelRefreshFromSidebar}) => {

    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/" style={{ textDecoration: "none" }}>
                        <img
                            src={logo}
                            width="200"
                            className="img-thumbnail"
                            style={{ marginTop: "40px" }}
                        /> 
                </Link>

            </div>
            <hr />
            <div className="center">
                <ul>
                    
                    <li className="" >
                        <StorageIcon className="icon" />
                        <Link to="/" onClick={handelRefreshFromSidebar} style={{ textDecoration: "none" }}>
                            <span>Devices</span>
                        </Link>
                    </li>

                </ul>
            </div>
        </div>

    )
}

export default Sidebar