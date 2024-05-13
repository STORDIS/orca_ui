import React, { useState, useEffect, useRef } from "react";

import interceptor from "../../utils/interceptor";
import { gptCompletionsURL } from "../../utils/backend_rest_urls";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";

import { Chart } from "react-google-charts";

import "./orcAsk.scss";
import CustomGraph from "./../../components/graph/CustomGraph";
import SigmaGraph from "./../../components/sigmaGraph/sigmaGraph";

export const AskOrca = () => {
    const [isBookMark, setIsBookMark] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [viewType, setViewType] = useState("Graph"); // table
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
            .post(gptCompletionsURL(), questionPrompt)
            .then((response) => {
                setCurrentChatHistory((prevChatHistory) => {
                    if (Array.isArray(response?.data)) {
                        const updatedHistory = [...prevChatHistory];

                        try {
                            let temp = JSON.parse(response?.data[0]);

                            let data = {
                                cols: temp.cols,
                                rows: temp.rows,
                            };
                            console.log(data);

                            updatedHistory[updatedHistory.length - 1].message =
                                data;
                            updatedHistory[updatedHistory.length - 1].type =
                                "chart";
                            return updatedHistory;
                        } catch {
                            if (Array.isArray(response?.data[0])) {
                                // console.log(response.data[0]);

                                updatedHistory[
                                    updatedHistory.length - 1
                                ].message = response?.data[0];
                                updatedHistory[updatedHistory.length - 1].type =
                                    "string";
                                return updatedHistory;
                            } else {
                                // console.log(response.data[0]);

                                updatedHistory[
                                    updatedHistory.length - 1
                                ].message = JSON.stringify(
                                    response?.data[0],
                                    null,
                                    2
                                );
                                updatedHistory[updatedHistory.length - 1].type =
                                    "string";
                                return updatedHistory;
                            }
                        }
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

    return (
        <div className="flexContainer">
            <div className="leftColumn">
                <div className="chatSection" ref={chatContainerRef}>
                    {currentChatHistory.map((item, index) => (
                        <>
                            {item.message ? (
                                <div key={item.index} className="aiStyle">
                                    <span className="material-symbols-outlined icon">
                                        smart_toy
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
                                                <SyntaxHighlighter
                                                    customStyle={{
                                                        borderRadius: "25px",
                                                        borderBottomLeftRadius:
                                                            "0px",
                                                        padding:
                                                            "10px 15px 10px 15px",
                                                        margin: "0px 0px 0px 10px",
                                                    }}
                                                    language="javascript"
                                                    style={prism}
                                                    wrapLines={true}
                                                    wrapLongLines={true}
                                                >
                                                    {item.message}
                                                </SyntaxHighlighter>
                                            ) : null}

                                            {item.type === "chart" ? (
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

                                                    {viewType !== "Graph" ? (
                                                        <Chart
                                                            chartType={viewType}
                                                            data={item.message}
                                                            width="100%"
                                                            height="-webkit-fill-available"
                                                            legendToggle
                                                        />
                                                    ) : null}

                                                    {viewType === "Graph" ? (
                                                        // <CustomGraph
                                                        //     message={
                                                        //         item.message
                                                        //     }
                                                        // />
                                                        <div className="graph" >
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
                                                    <span className="material-symbols-outlined">
                                                        content_copy
                                                    </span>
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
                                            <span className="material-symbols-outlined">
                                                content_copy
                                            </span>
                                        </CopyToClipboard>
                                    </span>
                                    <span className="text">{item.prompt}</span>
                                    <span className="material-symbols-outlined icon">
                                        person
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
                        disabled={isLoading}
                        onClick={gptCompletions}
                        className="btnStyle ml-10"
                    >
                        {!isLoading ? (
                            <span className="material-symbols-outlined">
                                arrow_upward
                            </span>
                        ) : null}
                        {isLoading ? (
                            <span className="material-symbols-outlined">
                                pending
                            </span>
                        ) : null}
                    </button>
                    <button
                        onClick={resetCurrentChat}
                        className="btnStyle ml-10"
                    >
                        <span className="material-symbols-outlined">
                            restart_alt
                        </span>
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
                        <span className="material-symbols-outlined mr-10">
                            bookmark
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
                        <span className="material-symbols-outlined mr-10">
                            <span className="material-symbols-outlined">
                                history
                            </span>
                        </span>
                        History
                    </div>
                </div>

                {isBookMark ? (
                    <>
                        <div className="bookmark">
                            <span className="material-symbols-outlined">
                                bookmark
                            </span>
                            <div className="title">
                                some text which is heading
                            </div>
                        </div>
                        <div className="bookmark">
                            <span className="material-symbols-outlined">
                                bookmark
                            </span>
                            <div className="title">
                                some text which is heading
                            </div>
                        </div>
                    </>
                ) : null}

                {!isBookMark ? (
                    <>
                        <a href="default" target="_blank" className="links">
                            <span className="material-symbols-outlined">
                                link
                            </span>
                            <div className="title">Link 1</div>
                        </a>
                        <a href="default" target="_blank" className="links">
                            <span className="material-symbols-outlined">
                                link
                            </span>
                            <div className="title">Link 2</div>
                        </a>
                    </>
                ) : null}
            </div>
        </div>
    );
};
export default AskOrca;
