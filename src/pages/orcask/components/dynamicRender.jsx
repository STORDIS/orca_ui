import React, { useEffect, useState, useMemo } from "react";
import "../orcAsk.scss";
import { AgGridReact } from "ag-grid-react";
import { defaultColDef } from "../../../components/tabbedpane/datatablesourse";
import SigmaGraph from "../../graphsNcharts/sigmaGraph/sigmaGraph";

const DynamicRender = (props) => {
    const [displayData, setDisplayData] = useState({
        message: "",
        responseType: "",
        type: "",
    });

    useEffect(() => {
        // console.log(props.message);
        checkWhichResponce(props.finalMessage);
    }, [props]);

    const checkWhichResponce = (res) => {
        // console.log(props.message);

        if (props.finalMessage.success.length > 0) {
            setDisplayData({
                message: props.finalMessage.success,
                responseType: "success",
                type: checkTypeofResponse(props.finalMessage.success),
            });
        } else if (
            Object.keys(props.finalMessage.functions_result).length > 0
        ) {
            setDisplayData({
                message: props.finalMessage.functions_result,
                responseType: "function",
                type: checkTypeofResponse(
                    props?.finalMessage?.functions_result
                ),
            });
        } else if (props.finalMessage.fail.length > 0) {
            setDisplayData({
                message: props.finalMessage.fail,
                responseType: "fail",
                type: checkTypeofResponse(props.finalMessage.fail),
            });
        } else {
            setDisplayData({
                message: "Unknown error",
                responseType: "unknown",
                type: checkTypeofResponse(""),
            });
        }
    };

    const checkTypeofResponse = (res) => {
        // console.log(typeof res, res);
        if (typeof res === "string") {
            return "string";
        } else if (Array.isArray(res)) {
            return "array";
        } else if (res !== null && typeof res === "object") {
            for (const key in res) {
                if (
                    res.hasOwnProperty(key) &&
                    Array.isArray(res[key]) &&
                    res[key].every(
                        (item) => typeof item === "object" && item !== null
                    )
                ) {
                    return "table_json"; // Return "table_json" if the structure matches
                }
            }

            return "json";
        } else {
            return "unknown";
        }
    };

    const generateColumnDefs = (data) => {
        let temp = undefined;

        if (Array.isArray(data[0])) {
            // console.log("true");
            temp = data[0];
        } else {
            // console.log("false");
            temp = data;
        }

        if (temp?.length > 0) {
            return Object.keys(temp[0]).map((key) => ({
                headerName: key.replace(/_/g, " ").toUpperCase(),
                field: key,
                resizable: true,
                filter: true,
                sortable: true,
                width: 130,
            }));
        }
        return [];
    };

    const getValue = (data) => {
        if (Array.isArray(data[0])) {
            return data[0];
        } else {
            return data;
        }
    };

    const [viewType, setViewType] = useState("table");

    const handleOptionChange = (e) => {
        setViewType(e.target.value);
    };

    const gridStyle = useMemo(() => ({ height: "300px", width: "100%" }), []);

    return (
        <div>
            {displayData.type === "array" ? (
                <div>
                    <ul
                        style={{ listStyleType: "none", padding: 0, margin: 0 }}
                    >
                        {displayData.message?.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            ) : displayData.type === "table_json" ? (
                <div>
                    {Object.entries(displayData.message).map(([key, value]) => (
                        <div
                            key={key}
                            style={{
                                marginBottom: "10px",
                                paddingBottom: "10px",
                                // borderBottom: "1px solid black",
                            }}
                        >
                            <div className="mt-5 mb-10 selectView">
                                {key}

                                <select
                                    className="selectView"
                                    name="selectView"
                                    value={viewType}
                                    onChange={handleOptionChange}
                                >
                                    <option value="table">Table</option>
                                    <option value="graph">Graph</option>
                                </select>
                            </div>
                            {viewType === "table" ? (
                                <div
                                    style={gridStyle}
                                    className="ag-theme-alpine"
                                >
                                    <AgGridReact
                                        rowData={getValue(value)}
                                        columnDefs={generateColumnDefs(value)}
                                        defaultColDef={defaultColDef}
                                        enableCellTextSelection="true"
                                    />
                                </div>
                            ) : viewType === "graph" ? (
                                <div className="graph" id="graph">
                                    <SigmaGraph message={getValue(value)} />
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {displayData.message.toString()}
                    <br />
                    {displayData.responseType}
                    <br />
                    {displayData.type}
                </div>
            )}
        </div>
    );
};

export default DynamicRender;
