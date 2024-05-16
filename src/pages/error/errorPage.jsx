import React, { useEffect } from "react";
import { Chart } from "react-google-charts";

const ErrorPage = () => {
    const data = {
        cols: [
            {
                label: "Lag Name",
                type: "string",
            },
            {
                label: "Active",
                type: "boolean",
            },
            {
                label: "Admin Status",
                type: "string",
            },
            {
                label: "MTU",
                type: "number",
            },
            {
                label: "Name",
                type: "string",
            },
            {
                label: "Fallback Operational",
                type: "boolean",
            },
            {
                label: "Operational Status",
                type: "string",
            },
            {
                label: "Speed",
                type: "string",
            },
            {
                label: "Operational Status Reason",
                type: "string",
            },
            {
                label: "ID",
                type: "number",
            },
        ],
        rows: [
            {
                c: [
                    {
                        v: "PortChannel102",
                    },
                    {
                        v: true,
                    },
                    {
                        v: "up",
                    },
                    {
                        v: 9100,
                    },
                    {
                        v: "lacp",
                    },
                    {
                        v: true,
                    },
                    {
                        v: "down",
                    },
                    {
                        v: "0",
                    },
                    {
                        v: "LACP_FAIL",
                    },
                    {
                        v: 157,
                    },
                ],
            },
            {
                c: [
                    {
                        v: "PortChannel101",
                    },
                    {
                        v: true,
                    },
                    {
                        v: "up",
                    },
                    {
                        v: 9100,
                    },
                    {
                        v: "lacp",
                    },
                    {
                        v: true,
                    },
                    {
                        v: "down",
                    },
                    {
                        v: "0",
                    },
                    {
                        v: "ALL_LINKS_DOWN",
                    },
                    {
                        v: 74,
                    },
                ],
            },
        ],
    };

    return (
        <div className="error-page-container">
            <div className="listContainer">
                <div className="listTitle">Page Not Found</div>

                <Chart
                    chartType={"Bar"}
                    data={data}
                    width="100%"
                    height="-webkit-fill-available"
                    legendToggle
                />
            </div>
        </div>
    );
};

export default ErrorPage;
