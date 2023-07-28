import "./navbar.scss"
import SearchIcon from '@mui/icons-material/Search';
import DiscoverButton from "./Discovery_btn";


const Navbar = () => {
    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Search..." />
                    <SearchIcon />
                </div>
                <div className="items">
                    <div className="item">
                        <DiscoverButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar