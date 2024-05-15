import React, { useRef, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { gptCompletionsURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";

const GoogleChart = (props) => {
    const instance = interceptor();
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({});

    useEffect(() => {
        console.log(props.message.index);

        if (Object.keys(data).length === 0) {
            console.log("If");

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
        } else {
            console.log("Else");
        }
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

            {!isLoading ? (
                <Chart
                    chartType={props.viewType}
                    data={data}
                    width="100%"
                    height="-webkit-fill-available"
                    legendToggle
                />
            ) : null}
        </div>
    );
};
export default GoogleChart;
