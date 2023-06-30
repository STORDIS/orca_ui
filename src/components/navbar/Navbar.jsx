import "./navbar.scss"
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Link } from "react-router-dom";
import { Button } from "@mui/base";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import axios from "axios";
import {getDiscoveryUrl} from "../../backend_rest_urls"


const Navbar = () => {
    const navigate = useNavigate();
    function handleDiscover() {
        axios(getDiscoveryUrl())
        .catch(err => console.log(err))
        

        //const handleRefresh = () => {
            const currentPath = window.location.pathname;
            const targetPath = '/discover';

            if (currentPath === targetPath) {
                window.location.reload(false); // Refresh the page
            } else {
                navigate(targetPath); // Redirect to the target path
            }
        //}
    }

    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Search..." />
                    <SearchIcon />
                </div>

                <div className="items">

                    <div className="item">
                        <Link to="/discover" onClick={handleDiscover} style={{ textDecoration: "none" }}>
                            <AccountTreeIcon className="icon" />
                            Discover Network
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Navbar