import React, { useEffect } from "react";
import * as d3 from "d3";

// import ChartContainer from "./../../components/d3Graph/temp";
// import ChartContainer from "./../../components/d3Graph/chartContainer";
import SigmaGraph from "../../components/sigmaGraph/sigmaGraph";

const ErrorPage = () => {
    const data = {
        cols: [
            {
                id: "vlanid",
                label: "VLAN ID",
                type: "number",
            },
            {
                id: "name",
                label: "Name",
                type: "string",
            },
            {
                id: "mtu",
                label: "MTU",
                type: "number",
            },
            {
                id: "admin_status",
                label: "Admin Status",
                type: "string",
            },
            {
                id: "oper_status",
                label: "Operational Status",
                type: "string",
            },
            {
                id: "autostate",
                label: "Autostate",
                type: "string",
            },
            {
                id: "id",
                label: "ID",
                type: "number",
            },
            {
                id: "members",
                label: "Members",
                type: "string",
            },
        ],
        rows: [
            {
                c: [
                    {
                        v: 3,
                    },
                    {
                        v: "Vlan3",
                    },
                    {
                        v: 9100,
                    },
                    {
                        v: "up",
                    },
                    {
                        v: "down",
                    },
                    {
                        v: "enable",
                    },
                    {
                        v: 156,
                    },
                    {
                        v: "",
                    },
                ],
            },
            {
                c: [
                    {
                        v: 2,
                    },
                    {
                        v: "Vlan2",
                    },
                    {
                        v: 9100,
                    },
                    {
                        v: "up",
                    },
                    {
                        v: "down",
                    },
                    {
                        v: "enable",
                    },
                    {
                        v: 155,
                    },
                    {
                        v: "",
                    },
                ],
            },
            {
                c: [
                    {
                        v: 1,
                    },
                    {
                        v: "Vlan1",
                    },
                    {
                        v: 9100,
                    },
                    {
                        v: "up",
                    },
                    {
                        v: "down",
                    },
                    {
                        v: "enable",
                    },
                    {
                        v: 154,
                    },
                    {
                        v: "",
                    },
                ],
            },
        ],
    };

    const data1 = {
        nodes: [
            {
                id: "1",
                label: "Vlan3",
                color: "Green",
            },
            {
                id: "2",
                label: "Vlan2",
                color: "Green",
            },
            {
                id: "3",
                label: "Vlan1",
                color: "Green",
            },
            {
                id: "0",
                label: "Device",
                color: "Red",
            },
        ],
        links: [
            {
                source: "0",
                target: "1",
                value: 1,
                name: "Vlan3-has",
            },
            {
                source: "0",
                target: "2",
                value: 1,
                name: "Vlan2-has",
            },
            {
                source: "0",
                target: "3",
                value: 1,
                name: "Vlan1-has",
            },
        ],
    };

    return (
        <div className="error-page-container">
            <div className="listContainer">
                <div className="listTitle">Page Not Found</div>
                <div className="graph">
                    {/* <ChartContainer message={data} /> */}

                    <SigmaGraph message={data} />
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
