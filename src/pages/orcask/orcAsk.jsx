import React, { useState, useEffect, useRef } from "react";

import interceptor from "../../interceptor";
import { gptCompletionsURL } from "../../backend_rest_urls";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";

import "./orcAsk.scss";

export const AskOrca = () => {
    const [isBookMark, setIsBookMark] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [questionPrompt, setQuestionPrompt] = useState({ prompt: "" });
    const [currentChatHistory, setCurrentChatHistory] = useState([
        {
            index: 0,
            message:
                "I am, ORCASK AI developed to assist you. How can I help you?",
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
                    "I am, ORCASK AI developed to assist you. How can I help you?",
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

        console.log(currentChatHistory);
        setQuestionPrompt({ prompt: "" });

        instance
            .post(gptCompletionsURL(), questionPrompt)
            .then((response) => {
                setCurrentChatHistory((prevChatHistory) => {
                    if (Array.isArray(response?.data)) {
                        const updatedHistory = [...prevChatHistory];
                        updatedHistory[updatedHistory.length - 1].message =
                            JSON.stringify(response?.data.pop(), null, 2);
                        return updatedHistory;
                    } else {
                        const updatedHistory = [...prevChatHistory];
                        updatedHistory[updatedHistory.length - 1].message =
                            JSON.stringify(response?.data?.message, null, 2);
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

    const chatSectionRef = useRef(null);

    useEffect(() => {
        // Scroll down to the bottom of the chat section
        chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
        // console.log(currentChatHistory);
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
                                        <SyntaxHighlighter
                                            customStyle={{
                                                borderRadius: "25px",
                                                borderBottomLeftRadius: "0px",
                                                padding: "10px 15px 10px 15px",
                                                margin: "0px 0px 0px 10px",
                                                background: "white",
                                            }}
                                            language="javascript"
                                            style={prism}
                                            wrapLines={true}
                                            wrapLongLines={true}
                                        >
                                            {item.message}
                                        </SyntaxHighlighter>
                                    ) : null}
                                </div>
                            ) : null}
                            {item.prompt ? (
                                <div key={item.index} className=" promptStyle">
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
