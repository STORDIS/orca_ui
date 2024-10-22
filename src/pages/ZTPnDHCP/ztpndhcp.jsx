import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./ztpndhcp.scss";

export const ZTPnDHCP = () => {
    const parentDivRef = useRef(null);

    const [code, setCode] = useState(
        `{"key": "value","key2": "value2","key3": "value3"}`
    );

    const [layout, setLayout] = useState({
        height: "60vh",
        width: "100%",
    });

    const [fileName, setFileName] = useState("script.js");

    const files = {
        "script.js": {
            name: "script.js",
            language: "javascript",
            value: "console.log('Hello World')",
        },
        "style.css": {
            name: "style.css",
            language: "css",
            value: "body { color: red; }",
        },
        "index.html": {
            name: "index.html",
            language: "html",
            value: "<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>",
        },
    };

    const file = files[fileName];

    useEffect(() => {
        window.addEventListener("resize", () => {
            handleResize();
        });
    }, []);

    const handleResize = () => {
        if (parentDivRef.current) {
            setLayout({
                height: parentDivRef.current.offsetHeight,
                width: parentDivRef.current.offsetWidth,
            });
        }
    };

    return (
        <div className="listContainer">
            <div
                ref={parentDivRef}
                className="resizable"
                onMouseMove={handleResize}
            >
                <div >
                    <button
                        disabled={fileName === "script.js"}
                        onClick={() => setFileName("script.js")}
                    >
                        script.js
                    </button>
                    <button
                        disabled={fileName === "style.css"}
                        onClick={() => setFileName("style.css")}
                    >
                        style.css
                    </button>
                    <button
                        disabled={fileName === "index.html"}
                        onClick={() => setFileName("index.html")}
                    >
                        index.html
                    </button>
                    <Editor
                        height={layout.height}
                        width={layout.width}
                        // defaultLanguage="json"
                        // defaultValue={code}
                        path={file.name}
                        defaultLanguage={file.language}
                        defaultValue={file.value}
                        theme="light" // light / vs-dark
                    />
                </div>
            </div>
        </div>
    );
};

export default ZTPnDHCP;
