import React, { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { FaBookmark } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaLink } from "react-icons/fa";

import "./orcAsk.scss";

import ChatSection from "./components/chatsection";

export const AskOrca = () => {
    const [isBookMark, setIsBookMark] = useState(true);

    const handelTabChanage = (e) => {
        setIsBookMark(e);
    };

    return (
        <div className="flexContainer">
            <div className="leftColumn">
                <ChatSection />
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
