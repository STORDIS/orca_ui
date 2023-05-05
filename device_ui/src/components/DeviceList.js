import React, { Component } from "react";
import { Table } from "reactstrap";
import NewDeviceModal from "./NewDeviceModal";

import ConfirmRemovalModal from "./ConfirmRemovalModal";

class DeviceList extends Component {
  render() {
    const device = this.props.device;
    return (
      <Table dark>
        <thead>
          <tr>
            <th>img_name</th>
            <th>mgt_intf</th>
            <th>mgt_ip</th>
            <th>hwsku</th>
            <th>mac</th>
            <th>platform</th>
            <th>type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!device || device.length <= 0 ? (
            <tr>
              <td colSpan="6" align="center">
                <b>Ops, no one here yet</b>
              </td>
            </tr>
          ) : (
            device.map(device => (
              <tr key={device.pk}>
                <td>{device.img_name}</td>
                <td>{device.mgt_intf}</td>
                <td>{device.mgt_ip}</td>
                <td>{device.hwsku}</td>
                <td>{device.mac}</td>
                <td>{device.platform}</td>
                <td>{device.type}</td>
                <td align="center">
                  <NewDeviceModal
                    create={false}
                    device={device}
                    resetState={this.props.resetState}
                  />
                  &nbsp;&nbsp;
                  <ConfirmRemovalModal
                    pk={device.pk}
                    resetState={this.props.resetState}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    );
  }
}

export default DeviceList;
