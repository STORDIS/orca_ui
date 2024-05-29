import React, { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { FaBookmark } from "react-icons/fa";

import "./orcAsk.scss";

import HistoryChatSection from "./components/historyChatSection";

export const AskOrca = () => {
    useEffect(() => {}, []);

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
