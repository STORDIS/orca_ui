import React, { useState, useEffect, useRef, useMemo } from "react";
import { gptCompletionsURL } from "../../../utils/backend_rest_urls";
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
import { getIsStaff } from "../../../utils/common";
import Tooltip from "@mui/material/Tooltip";

import "../orcAsk.scss";
import {
    getOrcAskHistoryURL,
    deleteOrcAskHistoryURL,
} from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import SigmaGraph from "../../graphsNcharts/sigmaGraph/sigmaGraph";
import { defaultColDef } from "../../../components/tabbedpane/datatablesourse";

export const HistoryChatSection = ({
    sendBookmarkDataToParent,
    copiedBookmark,
}) => {
    const instance = interceptor();
    const [isLoading, setIsLoading] = useState(false);
    const textAreaRef = useRef(null);
    const [chatHistory, setChatHistory] = useState([
        {
            id: 0,
            final_message: {
                success: [
                    "I am, ORCAsk AI developed to assist you. How can I help you?",
                ],
            },
            user_message: "",
            viewType: "string",
        },
    ]);
    const chatContainerRef = useRef(null);
    const gridStyle = useMemo(() => ({ height: "300px", width: "100%" }), []);
    const [questionPrompt, setQuestionPrompt] = useState({ prompt: "" });

    const handleInputChange = (event) => {
        setQuestionPrompt({ prompt: event?.target?.value });
    };

    useEffect(() => {
        getChatHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [isLoading]);

    useEffect(() => {
        if (copiedBookmark !== "") {
            setQuestionPrompt({
                prompt: copiedBookmark,
            });
            textAreaRef.current.focus();
        }
    }, [copiedBookmark]);

    useEffect(() => {
        if (!isLoading && textAreaRef.current) {
            textAreaRef.current.value = "";
            textAreaRef.current.focus();
        }
    }, [chatHistory, isLoading]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    };

    const getChatHistory = (index) => {
        instance
            .get(getOrcAskHistoryURL())
            .then((response) => {
                const newChatHistory = response?.data.map((chat) => ({
                    id: chat.id,
                    final_message: chat?.final_message,
                    user_message: chat?.user_message,
                    viewType: getChartType(chat?.final_message), // table / graph / string / json
                }));

                setChatHistory((prevChatHistory) => {
                    const existingIds = new Set(
                        prevChatHistory.map((chat) => chat?.id)
                    );

                    const filteredNewChatHistory = newChatHistory.filter(
                        (chat) => !existingIds.has(chat?.id)
                    );

                    return [...prevChatHistory, ...filteredNewChatHistory];
                });

                setIsLoading(false);

                // textAreaRef.current.value = "";
                // textAreaRef.current.focus();
                // console.log("here");
            })
            .catch((error) => {
                console.error("Error ", error);
                setIsLoading(false);
            });
    };

    const deleteHistory = () => {
        instance
            .delete(deleteOrcAskHistoryURL())
            .then((response) => {
                setChatHistory([
                    {
                        id: 0,
                        final_message: {
                            success: [
                                "I am, ORCAsk AI developed to assist you. How can I help you?",
                            ],
                        },
                        user_message: "",
                        viewType: "string",
                    },
                ]);
                getChatHistory();
            })
            .catch((error) => {
                console.error("Error ", error);
            });
    };

    const gptCompletions = () => {
        setIsLoading(true);
        instance
            .post(gptCompletionsURL("json"), questionPrompt)
            .then((response) => {
                setQuestionPrompt({ prompt: "" });

                getChatHistory();
            })
            .catch((error) => {
                console.error("Error ", error);
                setIsLoading(false);
                setQuestionPrompt({ prompt: "" });
                textAreaRef.current.value = "";
            });
    };

    const handleOptionChange = (e) => {
        let index = parseInt(e.target.id);
        setChatHistory((prevChatHistory) => {
            const updatedChatHistory = [...prevChatHistory];
            if (index >= 0 && index < updatedChatHistory?.length) {
                updatedChatHistory[index].viewType = e?.target?.value;
            }
            return updatedChatHistory;
        });
    };

    const generateColumnDefs = (data) => {
        if (data?.length > 0) {
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

    const getChartType = (e) => {
        if (Array.isArray(e?.success) && e?.success?.length > 0) {
            return "string";
        } else if (
            Array.isArray(e?.functions_result) &&
            e?.functions_result?.length > 0
        ) {
            return "table";
        } else if (
            Array.isArray(e?.functions_result) &&
            e?.functions_result?.length === 0
        ) {
            return "table";
        } else {
            return "unknown";
        }
    };

    const checkValidTableRes = (e) => {
        if (
            Array.isArray(e?.functions_result) &&
            e?.functions_result?.length > 0 &&
            e?.functions_result[0] !== null
        ) {
            return "table_data";
        } else if (
            Array.isArray(e?.functions_result) &&
            e?.functions_result?.length > 0 &&
            e?.functions_result[0] === null
        ) {
            console.log("wrong_data");
            return "no_data";
        } else if (
            Array.isArray(e?.functions_result) &&
            e?.functions_result?.length === 0
        ) {
            console.log("no_data");
            return "no_data";
        } else {
            console.log("false");
            return false;
        }
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            gptCompletions();
            event.preventDefault();
        }
    };

    const sendBookMarks = (user_message, final_meesage) => {
        let dataToParent = {
            prompt: user_message.trim(),
            message: final_meesage,
        };

        sendBookmarkDataToParent(dataToParent);
    };

    return (
        <>
            <div
                className="chatSection"
                id="chatSection"
                ref={chatContainerRef}
            >
                {chatHistory
                    .sort((a, b) => a.id - b.id)
                    .map((item, index) => (
                        <React.Fragment key={item.id} id={item.id}>
                            {item.user_message ? (
                                <div
                                    className="promptStyle"
                                    id={index + "-user"}
                                    index={index}
                                >
                                    <button
                                        disabled={!getIsStaff()}
                                        className="bookmark"
                                        id="bookmarkUser"
                                        onClick={() =>
                                            sendBookMarks(
                                                item.user_message,
                                                item.final_message
                                            )
                                        }
                                    >
                                        <FaBookmark />
                                    </button>
                                    <span className="copy" id="copyUser">
                                        <CopyToClipboard
                                            text={item.user_message}
                                            onCopy={() => {
                                                setQuestionPrompt({
                                                    prompt: item.user_message,
                                                });
                                                textAreaRef.current.focus();
                                            }}
                                        >
                                            <FaRegCopy />
                                        </CopyToClipboard>
                                    </span>
                                    <span className="text">
                                        {item.user_message}
                                    </span>
                                    <span className="icon">
                                        <FaUser />
                                    </span>
                                </div>
                            ) : null}
                            {item.final_message ? (
                                <div
                                    className="aiStyle"
                                    id={index + "-ai"}
                                    index={index}
                                >
                                    <span className="icon">
                                        <FaRobot />
                                    </span>
                                    {item.viewType === "string" ? (
                                        <div className="content">
                                            {item.final_message.success}
                                        </div>
                                    ) : item.viewType === "table" ||
                                      item.viewType === "graph" ? (
                                        <div className="content">
                                            <div className="selectView">
                                                <select
                                                    className="selectView"
                                                    name="selectView"
                                                    id={index.toString()}
                                                    value={item.viewType}
                                                    onChange={
                                                        handleOptionChange
                                                    }
                                                >
                                                    <option value="table">
                                                        Table
                                                    </option>

                                                    <option value="graph">
                                                        Graph
                                                    </option>
                                                </select>
                                            </div>
                                            {item.viewType === "table" &&
                                            checkValidTableRes(
                                                item.final_message
                                            ) === "table_data" ? (
                                                <div
                                                    style={gridStyle}
                                                    className="ag-theme-alpine"
                                                    id="table"
                                                >
                                                    <AgGridReact
                                                        rowData={
                                                            item?.final_message
                                                                ?.functions_result
                                                        }
                                                        columnDefs={generateColumnDefs(
                                                            item?.final_message
                                                                ?.functions_result
                                                        )}
                                                        defaultColDef={
                                                            defaultColDef
                                                        }
                                                        enableCellTextSelection="true"
                                                    />
                                                </div>
                                            ) : checkValidTableRes(
                                                  item.final_message
                                              ) === "no_data" ? (
                                                <div className="noData">
                                                    No data found
                                                </div>
                                            ) : null}
                                            {item.viewType === "graph" &&
                                            item?.final_message
                                                ?.functions_result.length >
                                                0 ? (
                                                <div
                                                    className="graph"
                                                    id="graph"
                                                >
                                                    <SigmaGraph
                                                        message={
                                                            item?.final_message
                                                                ?.functions_result
                                                        }
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : item?.viewType === "unknown" ? (
                                        <div className="content">
                                            <div className="error">
                                                Something went wrong
                                            </div>
                                        </div>
                                    ) : null}
                                    <span className="copy" id="copyAi">
                                        <CopyToClipboard
                                            text={item?.final_message}
                                        >
                                            <FaRegCopy />
                                        </CopyToClipboard>
                                    </span>
                                    {/* <span className="bookmark">
                                        <FaBookmark />
                                    </span> */}
                                </div>
                            ) : null}
                        </React.Fragment>
                    ))}
                {isLoading ? (
                    <>
                        <div className="promptStyle">
                            <span className="copy">
                                <button
                                    disabled={!getIsStaff()}
                                    className="bookmark"
                                >
                                    <FaBookmark />
                                </button>
                                <CopyToClipboard
                                    text={questionPrompt.prompt}
                                    onCopy={() => {
                                        setQuestionPrompt({
                                            prompt: questionPrompt.prompt,
                                        });
                                        textAreaRef.current.focus();
                                    }}
                                >
                                    <FaRegCopy />
                                </CopyToClipboard>
                            </span>

                            <span className="text">
                                {questionPrompt.prompt}
                            </span>
                            <span className="icon">
                                <FaUser />
                            </span>
                        </div>
                        <div className="aiStyle">
                            <span className="icon">
                                <FaRobot />
                            </span>
                            <div className="loader" id="loader">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

            <div className="promptArea" id="promptArea">
                <textarea
                    value={questionPrompt.prompt}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="textArea"
                    name="promptArea"
                    ref={textAreaRef}
                    disabled={isLoading || !getIsStaff()}
                    placeholder={`Ask me something......\nPress Enter to submit and 'shift + enter' for next Line`}
                ></textarea>
                <Tooltip place="bottom" title="Send Message">
                    <button
                        disabled={
                            isLoading ||
                            !getIsStaff() ||
                            questionPrompt.prompt === ""
                        }
                        onClick={gptCompletions}
                        className="btnStyle ml-10 "
                        id="sendMessageBtn"
                    >
                        {!isLoading ? <FaArrowUp /> : null}
                        {isLoading ? <FaSpinner /> : null}
                    </button>
                </Tooltip>
                <Tooltip place="bottom" title="Clear Chat">
                    <button
                        disabled={!getIsStaff() || chatHistory.length === 1}
                        onClick={deleteHistory}
                        className="btnStyle ml-10 "
                        id="clearChatBtn"
                    >
                        <FaRotateLeft />
                    </button>
                </Tooltip>
            </div>
        </>
    );
};
export default HistoryChatSection;
