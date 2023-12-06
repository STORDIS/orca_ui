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
                    <br />
                    <br />
                    <br />
                    <br />
                    <li>
                        <StorageIcon className="icon" />
                        <Nav.Link href="/" onClick={handleRefresh} style={{ textDecoration: "none" }}>
                            <span>Devices</span>

                        </Nav.Link>
                    </li>

                </ul>
            </div>
        </div>

    )
}

export default Sidebar