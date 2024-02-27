import "./navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import Discovery from "./Discovery_btn";
import { useAuth } from "../../utils/auth";

const Navbar = () => {

    const auth = useAuth();

    const handleLogout = () => {
        auth.logout();
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
