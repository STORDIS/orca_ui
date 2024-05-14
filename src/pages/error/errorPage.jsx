import React, { useEffect } from "react";
import * as d3 from "d3";

// import ChartContainer from "./../../components/d3Graph/temp";
// import ChartContainer from "./../../components/d3Graph/chartContainer";
import SigmaGraph from "../graphsNcharts/sigmaGraph/sigmaGraph";

// import GoogleChart from "../graphsNcharts/googleChart/googleChart";

const ErrorPage = () => {
    const data = {
        content: [
            {
                vlanid: 3,
                name: "Vlan3",
                mtu: 9100,
                oper_status: "down",
                autostate: "enable",
                ip_address: null,
                sag_ip_address: null,
                enabled: null,
                description: null,
                id: 156,
                members: [],
            },
            {
                vlanid: 2,
                name: "Vlan2",
                mtu: 9100,
                oper_status: "down",
                autostate: "enable",
                ip_address: null,
                sag_ip_address: null,
                enabled: null,
                description: null,
                id: 155,
                members: [],
            },
            {
                vlanid: 1,
                name: "Vlan1",
                mtu: 9100,
                oper_status: "down",
                autostate: "enable",
                ip_address: null,
                sag_ip_address: null,
                enabled: null,
                description: null,
                id: 154,
                members: [],
            },
        ],
        function_call: true,
    };



    const receiveChildData = (dataFromChild) => {
        console.log("Data received from child:", dataFromChild);
    };

    return (
        <div className="error-page-container">
            <div className="listContainer">
                <div className="listTitle">Page Not Found</div>
                <div className="graph">
                    {/* <ChartContainer message={data} /> */}

                    <SigmaGraph message={data} />

                    {/* <GoogleChart
                        message={"get vlans for ip 10.10.229.58"}
                        viewType={"Table"}
                        sendDataToParent={receiveChildData}
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
