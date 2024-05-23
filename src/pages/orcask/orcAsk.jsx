import React, { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { FaBookmark } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaLink } from "react-icons/fa";

import interceptor from "../../utils/interceptor";

import "./orcAsk.scss";

import ChatSection from "./components/chatsection";

import {
    getOrcAskHistory,
    deleteOrcAskHistory,
} from "../../utils/backend_rest_urls";

export const AskOrca = () => {
    const [isBookMark, setIsBookMark] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [chatRes, setChatRes] = useState(false);
    const instance = interceptor();

    const handelTabChanage = (e) => {
        setIsBookMark(e);
        deleteHistory();
    };

    useEffect(() => {
        getChatHistory();
    }, [chatRes]);

    const recivedData = (e) => {
        setChatRes(e);
    };

    const getChatHistory = () => {
        setChatHistory([]);
        instance
            .get(getOrcAskHistory())
            .then((response) => {
                // console.log(response.data);

                const newChatHistory = response.data.map((chat) => ({
                    id: chat.id,
                    final_message: chat.final_message,
                    user_message: chat.user_message,
                }));

                setChatHistory((prevChatHistory) => [
                    ...prevChatHistory,
                    ...newChatHistory,
                ]);
                setChatRes(false);
            })
            .catch((error) => {
                console.error("Error ", error);
                setChatRes(false);
            });
    };

    const deleteHistory = () => {
        // instance
        //     .delete(deleteOrcAskHistory())
        //     .then((response) => {
        //         console.log(response);
        //     })
        //     .catch((error) => {
        //         console.error("Error ", error);
        //     });
    };

    // console.log(chatHistory);

    const getJson = (item) => {
        // console.log(item.replace('"', ''));
        // return JSON.parse(item)

        let jsonString = item.replace(/'/g, '"');
        jsonString = jsonString
            .replace(/True/g, "true")
            .replace(/False/g, "false");
        jsonString = jsonString.replace(/None/g, "none");

        console.log(JSON.parse(jsonString));
        return JSON.parse(jsonString);

        // let parsedJson = JSON.parse(jsonString);
        // console.log(parsedJson)
        // try {
        //     let parsedJson = JSON.parse(jsonString);
        //     return parsedJson;
        // } catch (error) {
        //     console.error("Invalid JSON string:", error);
        // }
    };

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flexContainer">
            <div className="leftColumn">
                <ChatSection sendDataToParent={recivedData} />
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

                <div className="tabBody">
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
                            {chatHistory.map((item, index) => (
                                <div key={item.id} className="history">
                                    <div className=" userMessage">
                                        {item.id} . {item.user_message}
                                    </div>
                                    <div
                                        className={`aiMessage ${
                                            isExpanded ? "expanded" : ""
                                        }`}
                                        onClick={toggleExpansion}
                                    >
                                        {item.final_message}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
export default AskOrca;
