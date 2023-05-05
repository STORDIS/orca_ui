import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import DeviceList from "./DeviceList";
import NewDeviceModal from "./NewDeviceModal";

import axios from "axios";

import { API_URL } from "../constants";

class Home extends Component {
  state = {
    device: []
  };

  componentDidMount() {
    this.resetState();
  }

  getDevices = () => {
    axios.get(API_URL).then(res => this.setState({ device: res.data }));
  };

  resetState = () => {
    this.getDevices();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <Row>
          <Col>
            <DeviceList
              device={this.state.device}
              resetState={this.resetState}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewDeviceModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
