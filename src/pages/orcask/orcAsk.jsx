import React, { useState, useEffect, useRef, useMemo } from "react";
import { gptCompletionsURL } from "../../utils/backend_rest_urls";
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
import { FaBookmark } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { Chart } from "react-google-charts";

import "./orcAsk.scss";

import interceptor from "../../utils/interceptor";
import SigmaGraph from "../graphsNcharts/sigmaGraph/sigmaGraph";
import GoogleChart from "../graphsNcharts/googleChart/googleChart";

export const AskOrca = () => {
    const [isBookMark, setIsBookMark] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [viewType, setViewType] = useState("Table"); // Table / Graph / Bar
    const textAreaRef = useRef(null);

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

    const handelTabChanage = (e) => {
        setIsBookMark(e);
    };

    const resetCurrentChat = () => {
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
            },
        ]);

        setQuestionPrompt({ prompt: "" });
        textAreaRef.current.value = "";

        instance
            .post(gptCompletionsURL("json"), questionPrompt)
            .then((response) => {
                setCurrentChatHistory((prevChatHistory) => {
                    const updatedHistory = [...prevChatHistory];

                    console.log(typeof response?.data?.message.content);
                    console.log(response?.data?.message.content);

                    if (typeof response?.data?.message.content === "string") {
                        const updatedHistory = [...prevChatHistory];
                        updatedHistory[updatedHistory.length - 1].message =
                            JSON.stringify(
                                response?.data?.message.content,
                                null,
                                2
                            );
                        updatedHistory[updatedHistory.length - 1].type =
                            "string";
                        return updatedHistory;
                    } else if (response?.data?.message.content.length > 0) {
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
            })
            .catch((error) => {
                console.error("Error ", error);
                setIsLoading(false);
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
        setViewType(e.target.value);
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

    const receiveChildData = (dataFromChild) => {
        console.log("Data received from child:", dataFromChild);
        setIsDisabled(dataFromChild);
    };

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
        <div className="flexContainer">
            <div className="leftColumn">
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
                                                            id=""
                                                            value={viewType}
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

                                                    {viewType === "Bar" ? (
                                                        <GoogleChart
                                                            message={
                                                                currentChatHistory[
                                                                    index - 1
                                                                ]
                                                            }
                                                            viewType={viewType}
                                                            sendDataToParent={
                                                                receiveChildData
                                                            }
                                                        />
                                                    ) : null}
                                                    {viewType === "Table" ? (
                                                        <div
                                                            style={gridStyle}
                                                            className="ag-theme-alpine"
                                                        >
                                                            <AgGridReact
                                                                rowData={
                                                                    item.message
                                                                        .content
                                                                }
                                                                columnDefs={generateColumnDefs(
                                                                    item.message
                                                                        .content
                                                                )}
                                                            />
                                                        </div>
                                                    ) : null}

                                                    {viewType === "Graph" ? (
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
                        disabled={isLoading || isDisabled}
                        onClick={gptCompletions}
                        className="btnStyle ml-10"
                    >
                        {!isLoading && !isDisabled ? <FaArrowUp /> : null}
                        {isLoading || isDisabled ? <FaSpinner /> : null}
                    </button>
                    <button
                        onClick={resetCurrentChat}
                        className="btnStyle ml-10"
                    >
                        <FaRotateLeft />
                    </button>
                </div>
            </div>
            <div className=" rightColumn">
                <div className="tab">
                    <div
                        onClick={() => handelTabChanage(true)}
                        className={
                            !isBookMark
                                ? "tabButtonSelected"
                                : "tabButtonDeSelected"
                        }
                    >
                        <span className=" mr-10">
                            <FaBookmark />
                        </span>
                        Bookmark
                    </div>
                    <div
                        onClick={() => handelTabChanage(false)}
                        className={
                            isBookMark
                                ? "tabButtonSelected"
                                : "tabButtonDeSelected"
                        }
                    >
                        <span className=" mr-10">
                            <FaHistory />
                        </span>
                        History
                    </div>
                </div>

                {isBookMark ? (
                    <>
                        <div className="bookmark">
                            <FaBookmark />
                            <div className="title">
                                some text which is heading
                            </div>
                        </div>
                        <div className="bookmark">
                            <FaBookmark />
                            <div className="title">
                                some text which is heading
                            </div>
                        </div>
                    </>
                ) : null}

                {!isBookMark ? (
                    <>
                        <a href="default" target="_blank" className="links">
                            <FaLink />
                            <div className="title">Link 1</div>
                        </a>
                        <a href="default" target="_blank" className="links">
                            <FaLink />
                            <div className="title">Link 2</div>
                        </a>
                    </>
                ) : null}
            </div>
        </div>
    );
};
export default AskOrca;
