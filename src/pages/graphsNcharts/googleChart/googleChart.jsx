import React, { useRef, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { gptCompletionsURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";

const GoogleChart = (props) => {
    const instance = interceptor();
    const viewType = props.viewType;
    // const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({
        // cols: [
        //     {
        //         id: "vlanid",
        //         label: "VLAN ID",
        //         type: "number",
        //     },
        //     {
        //         id: "name",
        //         label: "Name",
        //         type: "string",
        //     },
        //     {
        //         id: "mtu",
        //         label: "MTU",
        //         type: "number",
        //     },
        //     {
        //         id: "admin_status",
        //         label: "Admin Status",
        //         type: "string",
        //     },
        //     {
        //         id: "oper_status",
        //         label: "Operational Status",
        //         type: "string",
        //     },
        //     {
        //         id: "autostate",
        //         label: "Autostate",
        //         type: "string",
        //     },
        //     {
        //         id: "id",
        //         label: "ID",
        //         type: "number",
        //     },
        //     {
        //         id: "members",
        //         label: "Members",
        //         type: "string",
        //     },
        // ],
        // rows: [
        //     {
        //         c: [
        //             {
        //                 v: 3,
        //             },
        //             {
        //                 v: "Vlan3",
        //             },
        //             {
        //                 v: 9100,
        //             },
        //             {
        //                 v: "up",
        //             },
        //             {
        //                 v: "down",
        //             },
        //             {
        //                 v: "enable",
        //             },
        //             {
        //                 v: 156,
        //             },
        //             {
        //                 v: "",
        //             },
        //         ],
        //     },
        //     {
        //         c: [
        //             {
        //                 v: 2,
        //             },
        //             {
        //                 v: "Vlan2",
        //             },
        //             {
        //                 v: 9100,
        //             },
        //             {
        //                 v: "up",
        //             },
        //             {
        //                 v: "down",
        //             },
        //             {
        //                 v: "enable",
        //             },
        //             {
        //                 v: 155,
        //             },
        //             {
        //                 v: "",
        //             },
        //         ],
        //     },
        //     {
        //         c: [
        //             {
        //                 v: 1,
        //             },
        //             {
        //                 v: "Vlan1",
        //             },
        //             {
        //                 v: 9100,
        //             },
        //             {
        //                 v: "up",
        //             },
        //             {
        //                 v: "down",
        //             },
        //             {
        //                 v: "enable",
        //             },
        //             {
        //                 v: 154,
        //             },
        //             {
        //                 v: "",
        //             },
        //         ],
        //     },
        // ],
    });

    useEffect(() => {
        setIsLoading(true);
        props.sendDataToParent(true);
        console.log(props.message.prompt);

        instance
            .post(gptCompletionsURL("google chart json for table"), {
                prompt: props.message,
            })
            .then((response) => {
                console.log(JSON.parse(response.data.message));
                setData(JSON.parse(response.data.message));
                setIsLoading(false);
                props.sendDataToParent(false);
            })
            .catch((error) => {
                console.error("Error ", error);
                setIsLoading(false);
                props.sendDataToParent(false);
            });
    }, [props.message.prompt]);

    return (
        <div>
            {isLoading ? (
                <span>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </span>
            ) : null}

            <Chart
                chartType={props.viewType}
                data={data}
                width="100%"
                height="-webkit-fill-available"
                legendToggle
            />
        </div>
    );
};
export default GoogleChart;
