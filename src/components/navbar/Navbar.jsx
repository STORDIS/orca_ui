import "./navbar.scss"
import SearchIcon from '@mui/icons-material/Search';
import Discovery from "./Discovery_btn";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Navbar = () => {
    return (
        <Row className="align-items-center py-3 p-0 m-0 border-bottom">
            <Col lg="4" className="" >
                <div className="search">
                    <input type="text" placeholder="Search..." />
                    <SearchIcon />
                </div>
            </Col>
            <Col lg="8" className="text-end">
                <Discovery />
            </Col>
         </Row>
    );
}

export default Navbar