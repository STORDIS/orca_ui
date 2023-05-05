import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";

class NewDeviceForm extends React.Component {
  state = {
    pk: 0,
    img_name: "",
    mgt_intf: "",
    mgt_ip: "",
    hwsku: "",
    mac:"",
    platform:"",
    type:"",
  };

  componentDidMount() {
    if (this.props.device) {
      const {pk, img_name,mgt_intf,mgt_ip,hwsku,mac,platform,type} = this.props.device;
      this.setState({ pk, img_name,mgt_intf,mgt_ip,hwsku,mac,platform,type});
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createDevice = e => {
    e.preventDefault();
    axios.post(API_URL, this.state).then(() => {
      this.props.resetState();
      this.props.toggle();
    });
  };

  editDevice = e => {
    e.preventDefault();
    axios.put(API_URL + this.state.pk, this.state).then(() => {
      this.props.resetState();
      this.props.toggle();
    });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  render() {
    return (
      <Form onSubmit={this.props.device ? this.editDevice : this.createDevice}>
        <FormGroup>
          <Label for="img_name">img_name:</Label>
          <Input
            type="text"
            name="img_name"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.img_name)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mgt_intf">mgt_intf:</Label>
          <Input
            type="text"
            name="mgt_intf"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.mgt_intf)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mgt_ip">mgt_ip:</Label>
          <Input
            type="text"
            name="mgt_ip"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.mgt_ip)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="hwsku">hwsku:</Label>
          <Input
            type="text"
            name="hwsku"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.hwsku)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mac">mac:</Label>
          <Input
            type="text"
            name="mac"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.mac)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="platform">platform:</Label>
          <Input
            type="text"
            name="platform"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.platform)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">type:</Label>
          <Input
            type="text"
            name="type"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.type)}
          />
        </FormGroup>
        
        <Button>Send</Button>
      </Form>
    );
  }
}

export default NewDeviceForm;
