import "./sidebar.scss"
import StorageIcon from '@mui/icons-material/Storage';
import { Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from "react-router-dom";

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
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBSglQwvsds3Oc30LqBjru9Un9f8V4mKoJ6A&usqp=CAU"
                            width="100"
                            className="img-thumbnail"
                            style={{ marginTop: "40px" }}
                        /> 
                    <span className="logo">ORCA - SONiC Management System</span>
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