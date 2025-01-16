import React, { useState, useEffect, useRef } from "react";
import { executePlanURL } from "../../../utils/backend_rest_urls";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaRobot } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { getIsStaff } from "../../../utils/common";
import Tooltip from "@mui/material/Tooltip";
import DynamicRender from "./dynamicRender";
import { AiOutlineClear } from "react-icons/ai";

import "../orcAsk.scss";
import {
  getOrcAskHistoryURL,
  deleteOrcAskHistoryURL,
} from "../../../utils/backend_rest_urls";
import interceptor from "../../../utils/interceptor";
import { temp } from "../predefinedBookMark";

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
      prompt_response: {
        default_message:
          "I am, ORCAsk AI developed to assist you. How can I help you?",
      },
      prompt: "",
    },
    // temp,
  ]);
  const chatContainerRef = useRef(null);
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
        // console.log(response.data);
        const newChatHistory = response?.data.map((chat) => ({
          id: chat.id,
          prompt_response: chat?.prompt_response,
          prompt: chat?.prompt,
        }));

        setChatHistory((prevChatHistory) => {
          const existingIds = new Set(prevChatHistory.map((chat) => chat?.id));

          const filteredNewChatHistory = newChatHistory.filter(
            (chat) => !existingIds.has(chat?.id)
          );

          return [...prevChatHistory, ...filteredNewChatHistory];
        });

        setIsLoading(false);
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
            prompt_response: {
              default_message:
                "I am, ORCAsk AI developed to assist you. How can I help you?",
            },
            prompt: "",
            viewType: "string",
          },
        ]);
        getChatHistory();
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const aiCompletion = (e) => {
    setIsLoading(true);
    instance
      .post(executePlanURL(), e)
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

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      aiCompletion(questionPrompt);
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

  const handelConfirmation = (e) => {
    console.log(e);
    setQuestionPrompt({
      prompt: e,
    });
    if (e === "Yes") {
      aiCompletion({
        prompt: e,
      });
    }
  };

  return (
    <>
      <div className="chatSection" id="chatSection" ref={chatContainerRef}>
        {chatHistory
          .sort((a, b) => a.id - b.id)
          .map((item, index) => (
            <React.Fragment key={item.id}>
              {item.prompt ? (
                <div className="promptStyle" id={index + "-user"} index={index}>
                  <button
                    disabled={!getIsStaff()}
                    className="bookmark"
                    id="bookmarkUser"
                    onClick={() =>
                      sendBookMarks(item.prompt, item.final_message)
                    }
                  >
                    <FaBookmark />
                  </button>
                  <span className="copy" id="copyUser">
                    <CopyToClipboard
                      text={item.prompt}
                      onCopy={() => {
                        setQuestionPrompt({
                          prompt: item.prompt,
                        });
                        textAreaRef.current.focus();
                      }}
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
              {item.prompt_response ? (
                <div className="aiStyle" id={index + "-ai"} index={index}>
                  <span className="icon">
                    <FaRobot />
                  </span>
                  <div style={{ width: "80%" }}>
                    <DynamicRender
                      prompt_response={item.prompt_response}
                      index={index}
                      confirmationToParent={handelConfirmation}
                    />
                  </div>
                </div>
              ) : null}
            </React.Fragment>
          ))}
        {isLoading ? (
          <>
            <div className="promptStyle">
              <span className="copy">
                <button disabled={!getIsStaff()} className="bookmark">
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

              <span className="text">{questionPrompt.prompt}</span>
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
              isLoading || !getIsStaff() || questionPrompt.prompt === ""
            }
            onClick={() => aiCompletion(questionPrompt)}
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
            <AiOutlineClear />
          </button>
        </Tooltip>
      </div>
    </>
  );
};
export default HistoryChatSection;
