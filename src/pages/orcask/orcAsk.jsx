import React, { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaBookmark } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import "./orcAsk.scss";
import {
  bookmarkURL,
  bookmarkDeleteAllURL,
} from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor";
import Tooltip from "@mui/material/Tooltip";

import HistoryChatSection from "./components/historyChatSection";
import { getIsStaff } from "../../utils/common";
import { predefinedBookMarks } from "./predefinedBookMark";

export const AskOrca = () => {
  const instance = interceptor();

  const [bookmarks, setBookmarks] = useState([]);
  const [copiedBookmark, setCopiedBookmark] = useState("");

  useEffect(() => {
    getBookmark();
  }, []);

  const getBookmark = () => {
    instance
      .get(bookmarkURL())
      .then((response) => {
        setBookmarks(response?.data);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const addBookmark = (e) => {
    instance
      .put(bookmarkURL(), e)
      .then((response) => {
        getBookmark();
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const deleteBookmark = (e) => {
    instance
      .delete(bookmarkURL(), { data: { bookmark_id: e } })
      .then((response) => {
        getBookmark();
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const deleteAllBookMark = () => {
    instance
      .delete(bookmarkDeleteAllURL())
      .then((response) => {
        getBookmark();
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const copyBookmark = (e) => {
    setCopiedBookmark(e);
    setTimeout(() => {
      setCopiedBookmark("");
    }, 1000);
  };

  return (
    <div className="flexContainer">
      <div className="leftColumn">
        <HistoryChatSection
          sendBookmarkDataToParent={addBookmark}
          copiedBookmark={copiedBookmark}
        />
      </div>
      <div className="rightColumn" id="bookmark">
        <div className="heading">
          <span className="mr-10">
            <FaBookmark />
          </span>
          User Bookmark
          <Tooltip place="bottom" title="Delete All Bookmark">
            <button
              disabled={!getIsStaff()}
              onClick={deleteAllBookMark}
              className="deleteIcon"
              id="deleteAllBookmark"
            >
              <FaTrashAlt />
            </button>
          </Tooltip>
        </div>

        <div className="tabBody">
          {bookmarks.map((item, index) => (
            <div className="bookmarkTitle">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => copyBookmark(item.prompt)}
              >
                <FaRegCopy />
              </span>
              <div className="ml-10">{item.prompt}</div>
              <Tooltip place="bottom" title="Delete This Bookmark">
                <button
                  onClick={() => deleteBookmark(item.bookmark_id)}
                  disabled={!getIsStaff()}
                  className="deleteIcon"
                  id="deleteBookmark"
                >
                  <FaTrashAlt />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>

        <div className="heading">
          <span className="mr-10">
            <FaBookmark />
          </span>
          Predefined Bookmark
        </div>
        <div
          style={{
            overflowX: "hidden",
            overflowY: "auto",
            height: "40%",
          }}
        >
          <div className="predefinedTabBody">
            {predefinedBookMarks.map((item, index) => (
              <div className="predefinedBookMark">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => copyBookmark(item.prompt)}
                >
                  <FaRegCopy />
                </span>
                <span className="ml-10" style={{ whiteSpace: "pre" }}>
                  {item.prompt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AskOrca;
