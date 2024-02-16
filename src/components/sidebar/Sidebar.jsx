import "./sidebar.scss"
import StorageIcon from '@mui/icons-material/Storage';
import { Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/orca.png'

const Sidebar = () => {
    const navigate = useNavigate();
        
      
        const handleRefresh = () => {
          const currentPath = window.location.pathname;
          const targetPath = '/';
      
          if (currentPath === targetPath) {
            window.location.reload(false); 
          } else {
            navigate(targetPath);
          }
        }
    return (
        <div className="sidebar">
            <Link to="/" style={{ textDecoration: "none" }}>
                <img src={logo} className="logo" />
            </Link>
            <div className="navLink d-flex ">
                <StorageIcon className="icon" />
                <Nav.Link
                href="/"
                onClick={handleRefresh}
                style={{ textDecoration: "none", marginLeft: '10px' }}
                >
                <span>Devices</span>
                </Nav.Link>
            </div>
        </div>
    );
}

export default Sidebar