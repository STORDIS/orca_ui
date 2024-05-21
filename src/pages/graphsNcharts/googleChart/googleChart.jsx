import React, { useRef, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { gptCompletionsURL } from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";

const GoogleChart = (props) => {
    const instance = interceptor();
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorChart, setIsErrorChart] = useState(false);

    const [data, setData] = useState({
       
    });

    useEffect(() => {
        console.log(props.message.index);

        if (Object.keys(data).length === 0) {
            setIsLoading(true);
            props.sendDataToParent(true);

            instance
                .post(gptCompletionsURL("google chart json for table"), {
                    prompt: props.message,
                })
                .then((response) => {
                    console.log(JSON.parse(response.data.message));

                    let tempData = JSON.parse(response.data.message);

                    if (tempData.cols.length > 0 && tempData.rows.length > 0) {
                        setIsErrorChart(false);
                        setData({
                            cols: tempData.cols,
                            rows: tempData.rows,
                        });
                    } else {
                        setIsErrorChart(true);
                    }

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
                <div style={{ width: "100%", textAlign: "center" }}>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            ) : null}

            {!isLoading && !isErrorChart ? (
                <Chart
                    chartType={props.viewType}
                    data={data}
                    width="100%"
                    height="-webkit-fill-available"
                    legendToggle
                />
            ) : null}

            {!isLoading && isErrorChart ? (
                <div>Chart cannot be created </div>
            ) : null}
        </div>
    );
};
export default GoogleChart;
