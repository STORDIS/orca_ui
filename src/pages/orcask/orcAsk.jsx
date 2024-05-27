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

import HistoryChatSection from "./components/historyChatSection";

export const AskOrca = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [chatRes, setChatRes] = useState(false);
    const instance = interceptor();

    useEffect(() => {
        getChatHistory();
        // deleteHistory();
    }, [chatRes]);

    const recivedData = (e) => {
        setChatRes(e);
    };

    const getChatHistory = () => {
        setChatHistory([]);
        instance
            .get(getOrcAskHistory())
            .then((response) => {
                console.log(response.data);

                const newChatHistory = response.data.map((chat) => ({
                    id: chat.id,
                    final_message: chat.final_message,
                    user_message: chat.user_message,
                }));

                // console.log(newChatHistory)

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

    console.log(chatHistory);

    const deleteHistory = () => {
        instance
            .delete(deleteOrcAskHistory())
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error("Error ", error);
            });
    };

    return (
        <div className="flexContainer">
            <div className="leftColumn">
                <HistoryChatSection />
            </div>
            <div className=" rightColumn">
                <div className="heading">
                    <span className="mr-10">
                        <FaBookmark />
                    </span>
                    Bookmark
                </div>

                <div className="tabBody">
                    <div className="bookmarkTitle">
                        <FaBookmark />
                        <div className="ml-10">some text which is heading</div>
                    </div>
                    <div className="bookmarkTitle">
                        <FaBookmark />
                        <div className="ml-10">some text which is heading</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AskOrca;
