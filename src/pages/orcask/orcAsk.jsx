import React, { useState, useEffect, useRef, useMemo } from "react";

import interceptor from "../../interceptor";
import { gptCompletionsURL } from "../../backend_rest_urls";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";

import "./orcAsk.scss";

export const AskOrca = () => {
    const [isBookMark, setIsBookMark] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isTable, setIsTable] = useState(false);
    const [keys, setKeys] = useState({});
    const [json, setJson] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [questionPrompt, setQuestionPrompt] = useState({ prompt: "" });
    const [currentChatHistory, setCurrentChatHistory] = useState([
        {
            index: 0,
            message:
                "I am, ORCAsk AI developed to assist you. How can I help you?",
            type: "string",
        },
    ]);

    const gridStyle = useMemo(() => ({ width: "100%" }), []);

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

    const handleMessageData = (data, prevChatHistory) => {
        const updatedHistory = [...prevChatHistory];
        switch (true) {
            case Array.isArray(data[0]):
                console.log("1");
                updatedHistory[updatedHistory.length - 1].message = data[0];
                updatedHistory[updatedHistory.length - 1].type = "json";
                break;
            case !Array.isArray(data[0]) && typeof data[0] === "object":
                console.log("2");
                updatedHistory[updatedHistory.length - 1].message = data;
                updatedHistory[updatedHistory.length - 1].type = "json";
                break;
            case !Array.isArray(data[0]) && typeof data[0] === "string":
                console.log("3");
                updatedHistory[updatedHistory.length - 1].message = data[0];
                updatedHistory[updatedHistory.length - 1].type = "string";
                break;
            default:
                console.log("4");
                updatedHistory[updatedHistory.length - 1].message =
                    data?.message;
                break;
        }
        return updatedHistory;
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
                type: "string",
            },
        ]);

        console.log(currentChatHistory);
        setQuestionPrompt({ prompt: "" });

        instance
            .post(gptCompletionsURL(), questionPrompt)
            .then((response) => {
                setCurrentChatHistory((prevChatHistory) => {
                    return handleMessageData(response?.data, prevChatHistory);
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


    const getKey = (event) => {
        const temp = Object.keys(event[0]).map((key) => ({
            headerName: key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            field: key,
            filter: true,
        }));
        return temp;
    };

    const chatSectionRef = useRef(null);

    const getMessage = (event) => {
        return JSON.stringify(event, null, 2);
    };

    useEffect(() => {
        chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
        console.log(currentChatHistory);
    }, [currentChatHistory]);

    return (
        <div className="flexContainer">
            <div className="leftColumn">
                <div className="chatSection" ref={chatSectionRef}>
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
                                                    {getMessage(item.message)}
                                                </SyntaxHighlighter>
                                            ) : null}
                                            {item.type === "json" ? (
                                                <div
                                                    style={gridStyle}
                                                    className="ag-theme-alpine"
                                                >
                                                    <AgGridReact
                                                        className="tableStyle"
                                                        rowData={item.message}
                                                        columnDefs={getKey(
                                                            item.message
                                                        )}
                                                        domLayout="autoHeight"
                                                    />
                                                </div>
                                            ) : null}

                                            <span className="copy">
                                                <CopyToClipboard
                                                    text={JSON.stringify(item.message, null, 4)}
                                                >
                                                    <span class="material-symbols-outlined">
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
                                        <CopyToClipboard text={item.prompt}>
                                            <span class="material-symbols-outlined">
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
                        className="textArea"
                        name=""
                        placeholder="Ask me something...... "
                    ></textarea>
                    <button onClick={gptCompletions} className="btnStyle ml-10">
                        <span className="material-symbols-outlined">
                            arrow_upward
                        </span>
                    </button>
                    <button
                        onClick={resetCurrentChat}
                        className="btnStyle ml-10"
                    >
                        <span class="material-symbols-outlined">
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
