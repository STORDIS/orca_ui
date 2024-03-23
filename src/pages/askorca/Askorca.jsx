import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

import "./Askorca.scss";

export const AskOrca = () => {
    const pythonCode = `import random

    # Define a list of fruits
    fruits = ["apple", "banana", "orange", "grape", "kiwi"]
    
    # Select a random fruit from the list
    random_fruit = random.choice(fruits)
    print("Random fruit selected:", random_fruit)
    
    # Generate a random number between 1 and 100
    random_number = random.randint(1, 100)
    print("Random number:", random_number)
    
    # Shuffle the list of fruits
    random.shuffle(fruits)
    print("Shuffled fruits:", fruits)
    `;

    const jsCode = `
    // Define a function to generate a random number between 1 and 10
    function generateRandomNumber() {
      return Math.floor(Math.random() * 10) + 1;
    }
    
    // Call the function and store the result
    const randomNumber = generateRandomNumber();
    
    // Log the random number to the console
    console.log("Random number:", randomNumber);
      `;

    const codeLangauge = "javascript";

    const [isBookMark, setIsBookMark] = useState(true);

    const handelTabChanage = (e) => {
        console.log(e);
        setIsBookMark(e);
    };

    return (
        <div className="flexContainer">
            <div className="leftColumn">
                <div className="topColumn">
                    <div className="codeSection">
                        <SyntaxHighlighter
                            language={codeLangauge}
                            style={darcula}
                        >
                            {pythonCode}
                        </SyntaxHighlighter>
                    </div>
                    <div className="buttonSection ">
                        <button className="btnStyle mr-10">Execute</button>
                        <button className="btnStyle mr-10">Test</button>
                        <button className="btnStyle ">Save</button>
                    </div>
                </div>
                <div className="bottomColumn">
                    <div className="chatSection">
                        <div className="aiStyle">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Neque, blanditiis. Maxime tenetur laboriosam
                            veritatis eaque reprehenderit sint quos facilis
                            corporis? Expedita praesentium accusantium labore
                            dolorem optio iure impedit unde officiis?
                        </div>
                        <div className="promtStyle">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Molestiae, modi labore optio distinctio
                            ducimus corporis laborum omnis, minima sit
                            perspiciatis impedit temporibus unde cupiditate in
                            eveniet consequatur, ex quas! Rerum.
                        </div>
                    </div>
                    <div className="promptArea">
                        <textarea
                            className="textArea"
                            name=""
                            placeholder="Ask me something...... "
                        ></textarea>
                        <button className="btnStyle ml-10">
                            <span class="material-symbols-outlined">
                                arrow_upward
                            </span>
                        </button>
                    </div>
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
                        <span class="material-symbols-outlined mr-10">
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
                        <span class="material-symbols-outlined mr-10">
                            link
                        </span>
                        Api Docs
                    </div>
                </div>

                {isBookMark ? (
                    <>
                        <div className="bookmark">
                            <span class="material-symbols-outlined">
                                bookmark
                            </span>
                            <div className="title">
                                some text which is heading
                            </div>
                        </div>
                        <div className="bookmark">
                            <span class="material-symbols-outlined">
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
                        <a href="default" className="links">
                            <span class="material-symbols-outlined">link</span>
                            <div className="title">Link 1</div>
                        </a>
                        <a href="default" className="links">
                            <span class="material-symbols-outlined">link</span>
                            <div className="title">Link 2</div>
                        </a>
                    </>
                ) : null}
            </div>
        </div>
    );
};
export default AskOrca;
