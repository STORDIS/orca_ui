import "./sidebar.scss"
import StorageIcon from '@mui/icons-material/Storage';
import { Link } from "react-router-dom";
import logo from '../../assets/orca.png'
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/home');
    };
      
    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/home" style={{ textDecoration: "none" }}>
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
                    <li className="" onClick={handleClick} style={{ textDecoration: "none" }} >
                        <StorageIcon className="icon" />
                        <span>Devices</span>
                    </li>
                </ul>
            </div>
        </div>

    )
}

export default Sidebar