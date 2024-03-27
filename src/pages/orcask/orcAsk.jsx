import React, { useState, useEffect, useRef } from "react";

import interceptor from "../../interceptor";
import { gptCompletionsURL } from "../../backend_rest_urls";

import "./orcAsk.scss";

export const AskOrca = () => {
    const [isBookMark, setIsBookMark] = useState(true);

    const [questionPrompt, setQuestionPrompt] = useState({ prompt: "" });

    const [currentChatHistory, setCurrentChatHistory] = useState([
        { index: 0, message: "i am orca AI. How can I, help you ?" },
    ]);

    const instance = interceptor();

    const handelTabChanage = (e) => {
        setIsBookMark(e);
    };

    const gptCompletions = () => {
        console.log(questionPrompt);

        setCurrentChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            {
                index: prevChatHistory.length,
                ...questionPrompt,
            },
        ]);

        console.log(currentChatHistory);
        setQuestionPrompt({ prompt: "" });

        instance
            .post(gptCompletionsURL(), questionPrompt)
            .then((response) => {
                console.log(response.data);
                setCurrentChatHistory((prevChatHistory) => [
                    ...prevChatHistory,
                    {
                        index: prevChatHistory.length,
                        ...response.data,
                    },
                ]);
            })
            .catch((error) => {
                console.error("Error ", error);
            });
    };

    const handleInputChange = (event) => {
        setQuestionPrompt({ prompt: event.target.value });
    };

    const chatSectionRef = useRef(null);

    useEffect(() => {
        // Scroll down to the bottom of the chat section
        chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
    }, [currentChatHistory]);

    return (
        <div className="flexContainer">
            <div className="leftColumn">
                <div className="chatSection" ref={chatSectionRef}>
                    {currentChatHistory.map((item) => (
                        <>
                            {item.message ? (
                                <div key={item.index} className="aiStyle">
                                    <span className="material-symbols-outlined icon">
                                        smart_toy
                                    </span>
                                    <span className="text">
                                        {item.index} - {item.message}
                                    </span>
                                </div>
                            ) : null}
                            {item.prompt ? (
                                <div key={item.index} className=" promptStyle">
                                    <span className="text">
                                        {item.index} - {item.prompt}
                                    </span>
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
