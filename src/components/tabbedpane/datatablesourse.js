import { Link } from "react-router-dom";
import React from "react";
import EditableHeaderComponent from "./EditableHeaderComponent";

export const defaultColDef = {
    tooltipValueGetter: (params) => {
        return params.value;
    },
    resizable: true,
    rowSelection: "multiple",
    enableCellTextSelection: "true",
    singleClickEdit: "true",
    stopEditingWhenCellsLoseFocus: "true",
};

export const interfaceColumns = [
    {
        field: "name",
        headerName: "Name",
        width: 130,
        getQuickFilterText: (params) => {
            if (params.data.name.includes("Ethernet")) {
                return params.data.name;
            }
        },
        sortable: true,
    },
    {
        field: "enabled",
        headerName: "Enabled",
        width: 130,
        cellRenderer: "agCheckboxCellRenderer",
        cellEditor: "agCheckboxCellEditor",
        editable: true,
        suppressKeyboardEvent: (params) => params.event.key === " ",
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "mtu",
        headerName: "MTU",
        type: "number",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "fec",
        headerName: "FEC",
        width: 130,
        editable: true,
        cellEditor: "agSelectCellEditor",
        singleClickEdit: true,
        stopEditingWhenCellsLoseFocus: true,
        cellEditorParams: {
            values: ["FEC_RS", "FEC_FC", "FEC_DISABLED", "FEC_AUTO"],
        },
        headerComponent: EditableHeaderComponent,
    },
    { field: "oper_sts", headerName: "Oper_STS", width: 130, sortable: true },
    {
        field: "speed",
        headerName: "Speed",
        width: 130,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: [
                "SPEED_1GB",
                "SPEED_5GB",
                "SPEED_10GB",
                "SPEED_25GB",
                "SPEED_40GB",
                "SPEED_50GB",
                "SPEED_100GB",
            ],
        },
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "admin_sts",
        headerName: "Admin Status",
        width: 130,
        sortable: true,
    },
    {
        field: "description",
        headerName: "Description",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "last_chng",
        headerName: "Last Change",
        width: 130,
        sortable: true,
    },
    { field: "mac_addr", headerName: "MAC ADDR", width: 130, sortable: true },
];

export const portGroupColumns = [
    { field: "port_group_id", headerName: "ID", width: 130, sortable: true },
    {
        field: "speed",
        headerName: "Speed",
        width: 130,
        editable: (params) => {
            const regex = /Management*/i;
            if (regex.test(params.data.name)) {
                return false;
            } else {
                return true;
            }
        },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: (params) => {
            return {
                values: params.data.valid_speeds,
            };
        },
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "valid_speeds",
        headerName: "Valid Speeds",
        cellDataType: "text",
        width: 130,
        sortable: true,
    },
    {
        field: "default_speed",
        headerName: "Default Speed",
        cellDataType: "text",
        width: 130,
        sortable: true,
    },
    {
        field: "mem_intfs",
        headerName: "Member IFs",
        cellDataType: "text",
        width: 130,
        sortable: true,
    },
];

export const vlanColumns =  [
    {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        sortable: true,
    },
    {
        field: "vlanid",
        headerName: "Vlan ID",
        type: "number",
        width: 90,
        sortable: true,
    },
    { field: "name", headerName: "Name", width: 130, sortable: true },
    {
        field: "description",
        headerName: "Description",
        width: 130,
        sortable: true,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "autostate",
        headerName: "Autostate",
        width: 130,
        sortable: true,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "ip_address",
        headerName: "IP Address",
        width: 130,
        sortable: true,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "sag_ip_address",
        headerName: "Anycast Address",
        width: 130,
        sortable: true,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "mtu",
        headerName: "MTU",
        type: "number",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "enabled",
        headerName: "Status",
        type: "boolean",
        width: 150,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: ["up", "down"],
        },
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "oper_status",
        headerName: "Oper_STS",
        type: "boolean",
        width: 130,
        sortable: true,
    },
    {
        field: "members",
        headerName: "Member IFs",
        width: 130,
        editable: true,
        // cellEditorParams: { values: interfaceNames },
        headerComponent: EditableHeaderComponent,
    },
];

export const portChannelColumns = [
    {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        sortable: true,
    },
    {
        field: "lag_name",
        headerName: "Channel Name",
        width: 130,
        sortable: true,
    },
    {
        field: "active",
        headerName: "Active",
        type: "boolean",
        width: 130,
        sortable: true,
    },
    {
        field: "admin_sts",
        headerName: "Admin Status",
        width: 150,
        editable: (params) => {
            const regex = /Management*/i;
            if (regex.test(params.data.name)) {
                return false;
            } else {
                return true;
            }
        },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: ["up", "down"],
        },
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "mtu",
        headerName: "MTU",
        type: "number",
        width: 130,
        editable: (params) => {
            const regex = /Management*/i;
            if (regex.test(params.data.name)) {
                return false;
            } else {
                return true;
            }
        },
        headerComponent: EditableHeaderComponent,
    },
    { field: "name", headerName: "Name", width: 130, sortable: true },
    {
        field: "fallback_operational",
        headerName: "Fallback Operation",
        type: "boolean",
        width: 130,
        sortable: true,
    },
    {
        field: "oper_sts",
        headerName: "Operation Status",
        width: 130,
        sortable: true,
    },
    { field: "speed", headerName: "Speed", width: 130, sortable: true },
    {
        field: "oper_sts_reason",
        headerName: "OperReason",
        width: 130,
        sortable: true,
    },
    {
        field: "members",
        headerName: "Members",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
];

export const mclagColumns = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
    {
        field: "domain_id",
        headerName: "Domain_ID",
        type: "number",
        width: 130,
        sortable: true,
    },
    {
        field: "keepalive_interval",
        headerName: "Keepalive Interval",
        type: "number",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
        sortable: true,
    },
    {
        field: "mclag_sys_mac",

        headerName: "MCLAG Sys MAC",

        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
        sortable: true,
    },
    {
        field: "peer_addr",

        headerName: "Peer Address",

        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
        sortable: true,
    },
    {
        field: "peer_link",
        headerName: "Peer Link",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
        sortable: true,
    },
    {
        field: "session_timeout",
        headerName: "Session Timeout",
        type: "number",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
        sortable: true,
    },
    {
        field: "source_address",

        headerName: "Source Address",

        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,

        sortable: true,
    },
    {
        field: "oper_status",
        headerName: "Operation Status",
        width: 130,
        sortable: true,
    },
    {
        field: "role",
        headerName: "Role",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
        sortable: true,
    },
    {
        field: "gateway_macs",

        headerName: "Gateway MAC",

        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,

        sortable: true,
    },
    {
        field: "delay_restore",
        headerName: "Delay Restore",
        type: "number",
        width: 130,
        editable: true,
        headerComponent: EditableHeaderComponent,
        sortable: true,
    },
];

export const bgpColumns = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
    {
        field: "local_asn",
        headerName: "ASN",
        width: 130,
        sortable: true,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "vrf_name",
        headerName: "VRF",
        width: 130,
        sortable: true,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "router_id",
        headerName: "Router ID",
        width: 130,
        sortable: true,
        editable: true,
        headerComponent: EditableHeaderComponent,
    },
    {
        field: "neighbor_prop",
        headerName: "Neighbors",
        width: 130,
        sortable: true,
    },
];

export const deviceUserColumns = (isTabbedPane = true) => {
    let dataColumn = [
        {
            field: "img_name",
            headerName: "Image Name",
            width: 130,
            sortable: true,
        },
        {
            field: "mgt_intf",
            headerName: "Management Int",
            width: 130,
            sortable: true,
        },
        {
            field: "mgt_ip",
            headerName: "Management IP",
            width: 130,
            sortable: true,
        },
        {
            field: "hwsku",
            headerName: "HWSKU",
            type: "number",
            width: 130,
            sortable: true,
        },

        {
            field: "mac",
            headerName: "MAC",
            width: 130,
            sortable: true,
        },

        {
            field: "platform",
            headerName: "PLATFORM",
            width: 130,
            sortable: true,
        },
        { field: "type", headerName: "TYPE", width: 130, sortable: true },
    ];

    if (!isTabbedPane) {
        dataColumn.push({
            field: "action",
            headerName: "Action",
            width: 200,
            cellRenderer: (params) => {
                return (
                    <>
                        <Link to={`/devices/${params.data.mgt_ip}`}>
                            <button className="btnStyle">Details</button>
                        </Link>
                        <button className=" ml-10 btnStyle">Remove</button>
                    </>
                );
            },
        });
    }
    return dataColumn;
};
