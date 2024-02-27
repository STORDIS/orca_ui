import "./navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import Discovery from "./Discovery_btn";

import { useAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        window.location.href = "/login";
    };

    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Search..." />
                    <SearchIcon />
                </div>
                <div className="items">
                    <div className="item">
                        <Discovery />
                    </div>

                    <div className="items" onClick={handleLogout}>
                        <button>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
