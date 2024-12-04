import React, { useState, useEffect, useRef, useMemo } from "react";
import { executePlanURL } from "../../../utils/backend_rest_urls";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { FaRobot } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaRotateLeft } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { Chart } from "react-google-charts";
import "../orcAsk.scss";
import interceptor from "../../../utils/interceptor";
import SigmaGraph from "../../graphsNcharts/sigmaGraph/sigmaGraph";

export const ChatSection = ({sendDataToParent}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingChart, setIsLoadingChart] = useState(false);
    const textAreaRef = useRef(null);

    const [googleChartData, setGoogleChartData] = useState([]);

    const [questionPrompt, setQuestionPrompt] = useState({ prompt: "" });
    const [currentChatHistory, setCurrentChatHistory] = useState([
        {
            index: 0,
            message:
                "I am, ORCAsk AI developed to assist you. How can I help you?",
            type: "string",
        },
    ]);

    const instance = interceptor();

    const resetCurrentChat = () => {
        setGoogleChartData([]);
        setCurrentChatHistory([
            {
                index: 0,
                message:
                    "I am, ORCAsk AI developed to assist you. How can I help you?",
                type: "string",
            },
        ]);
    };

    const gptCompletions = () => {
        setIsLoading(true);

        setCurrentChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            {
                index: prevChatHistory.length,
                ...questionPrompt,
            },
            {
                index: prevChatHistory.length + 1,
                message: [],
                viewType: "Table",
            },
        ]);

        setQuestionPrompt({ prompt: "" });
        textAreaRef.current.value = "";

        instance
            .post(executePlanURL(), questionPrompt)
            .then((response) => {
                setCurrentChatHistory((prevChatHistory) => {
                    const updatedHistory = [...prevChatHistory];

                    if (typeof response?.data?.message === "string") {
                        const updatedHistory = [...prevChatHistory];
                        updatedHistory[updatedHistory.length - 1].message =
                            JSON.stringify(response?.data?.message, null, 2);
                        updatedHistory[updatedHistory.length - 1].type =
                            "string";
                        return updatedHistory;
                    } else if (response?.data?.message.length > 0) {
                        updatedHistory[updatedHistory.length - 1].message =
                            response?.data?.message;
                        updatedHistory[updatedHistory.length - 1].type =
                            "resData";
                        return updatedHistory;
                    } else {
                        const updatedHistory = [...prevChatHistory];
                        updatedHistory[updatedHistory.length - 1].message =
                            JSON.stringify(response?.data?.message, null, 2);
                        updatedHistory[updatedHistory.length - 1].type =
                            "string";
                        return updatedHistory;
                    }
                });

                setIsLoading(false);
                sendDataToParent(true);
            })
            .catch((error) => {
                console.error("Error ", error);
                setIsLoading(false);
                sendDataToParent(true);
            });
    };

    const handleInputChange = (event) => {
        setQuestionPrompt({ prompt: event.target.value });
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            gptCompletions();
            event.preventDefault();
        }
    };

    const chatContainerRef = useRef(null);

    const handleOptionChange = (e) => {
        let index = parseInt(e.target.id);

        setCurrentChatHistory((prevChatHistory) => {
            const updatedChatHistory = [...prevChatHistory];

            if (index >= 0 && index < updatedChatHistory.length) {
                updatedChatHistory[index].viewType = e.target.value;
            }

            return updatedChatHistory;
        });

        if (e.target.value === "Bar") {
            getGoogleChart(e.target.id);
        }
    };

    const getGoogleChart = (index) => {

        if (
            !googleChartData[index]?.cols?.length !== 0 &&
            !googleChartData[index]
        ) {
            setIsLoadingChart(true);

            instance
                .post(executePlanURL(), {
                    prompt: currentChatHistory[index - 1],
                })
                .then((response) => {

                    let tempData = JSON.parse(response.data.message);

                    if (tempData.cols.length > 0 && tempData.rows.length > 0) {
                        setGoogleChartData((prevChatHistory) => {
                            const updatedChatHistory = [...prevChatHistory];

                            updatedChatHistory[index] = {
                                cols: tempData.cols,
                                rows: tempData.rows,
                            };
                            return updatedChatHistory;
                        });
                        setIsLoadingChart(false);
                        sendDataToParent(true);
                    } else {
                        setIsLoadingChart(false);
                        sendDataToParent(true);
                    }
                })
                .catch((error) => {
                    console.error("Error ", error);
                    setIsLoadingChart(false);
                });
        } else {
        }
    };

    useEffect(() => {
        if (isLoading && chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [isLoading]);

    useEffect(() => {
        if (!isLoading && chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [isLoading]);

    const gridStyle = useMemo(() => ({ height: "300px", width: "100%" }), []);

    const generateColumnDefs = (data) => {
        if (data.length > 0) {
            return Object.keys(data[0]).map((key) => ({
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

    return (
        <>
            <div className="chatSection" ref={chatContainerRef}>
                {currentChatHistory.map((item, index) => (
                    <>
                        {item.message ? (
                            <div key={item.index} className="aiStyle">
                                <span className="icon">
                                    <FaRobot />
                                </span>
                                {index === currentChatHistory.length - 1 &&
                                isLoading ? (
                                    <div className="loader">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                ) : null}
                                {!isLoading ||
                                index !== currentChatHistory.length - 1 ? (
                                    <>
                                        {item.type === "string" ? (
                                            <div className="content">
                                                {item.message}
                                            </div>
                                        ) : null}

                                        {item.type === "resData" ? (
                                            <div className="content">
                                                <div className="selectView">
                                                    <select
                                                        className="selectView"
                                                        name=""
                                                        id={index}
                                                        value={item.viewType}
                                                        onChange={
                                                            handleOptionChange
                                                        }
                                                    >
                                                        <option value="Table">
                                                            Table
                                                        </option>
                                                        <option value="Bar">
                                                            Bar
                                                        </option>
                                                        <option value="Graph">
                                                            Graph
                                                        </option>
                                                    </select>
                                                </div>

                                                {item.viewType === "Bar" &&
                                                !isLoadingChart ? (
                                                    <div>
                                                        <Chart
                                                            chartType="Bar"
                                                            data={
                                                                googleChartData[
                                                                    index
                                                                ]
                                                            }
                                                            width="100%"
                                                            height="100%"
                                                            legendToggle
                                                        />
                                                    </div>
                                                ) : null}
                                                {item.viewType === "Bar" &&
                                                isLoadingChart ? (
                                                    <div className="loader">
                                                        <div className="dot"></div>
                                                        <div className="dot"></div>
                                                        <div className="dot"></div>
                                                    </div>
                                                ) : null}
                                                {item.viewType === "Table" ? (
                                                    <div
                                                        style={gridStyle}
                                                        className="ag-theme-alpine"
                                                    >
                                                        <AgGridReact
                                                            rowData={
                                                                item.message
                                                            }
                                                            columnDefs={generateColumnDefs(
                                                                item.message
                                                            )}
                                                        />
                                                    </div>
                                                ) : null}

                                                {item.viewType === "Graph" ? (
                                                    <div className="graph">
                                                        <SigmaGraph
                                                            message={
                                                                item.message
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}

                                        <span className="copy">
                                            <CopyToClipboard
                                                text={item.message}
                                            >
                                                <FaRegCopy />
                                            </CopyToClipboard>
                                        </span>
                                    </>
                                ) : null}
                            </div>
                        ) : null}
                        {item.prompt ? (
                            <div key={item.index} className=" promptStyle">
                                <span className="copy">
                                    <CopyToClipboard
                                        text={item.prompt}
                                        onCopy={() =>
                                            setQuestionPrompt({
                                                prompt: item.prompt,
                                            })
                                        }
                                    >
                                        <FaRegCopy />
                                    </CopyToClipboard>
                                </span>
                                <span className="text">{item.prompt}</span>

                                <span className="icon">
                                    <FaUser />
                                </span>
                            </div>
                        ) : null}
                    </>
                ))}
            </div>

            <div className="promptArea">
                <textarea
                    value={questionPrompt.prompt}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="textArea"
                    name=""
                    ref={textAreaRef}
                    placeholder={`Ask me something......\nPress Enter to submit and 'shift + enter' for next Line`}
                ></textarea>
                <button
                    disabled={isLoading || isLoadingChart}
                    onClick={gptCompletions}
                    className="btnStyle ml-10"
                >
                    {!isLoading && !isLoadingChart ? <FaArrowUp /> : null}
                    {isLoading || isLoadingChart ? <FaSpinner /> : null}
                </button>
                <button onClick={resetCurrentChat} className="btnStyle ml-10">
                    <FaRotateLeft />
                </button>
            </div>
        </>
    );
};
export default ChatSection;
