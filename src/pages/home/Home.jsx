import Datatable from "../../components/tabbedpane/Datatable";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

import "./home.scss";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Home(props) {
  return (
    <Container fluid>
      <Row>
        <Col lg="2">
          <Sidebar />
        </Col>
        <Col lg="10">
          <Navbar />
          <div className="px-3">
            <div className="">Devices</div>
            <Datatable />
          </div>
          <div className="px-3">{props.logViewer}</div>
        </Col>
      </Row>
    </Container>
  );
}
export default Home;
