import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./ztpndhcp.scss";
import { FaRegCircleXmark } from "react-icons/fa6";

export const ZTPnDHCP = () => {
    const parentDivRef = useRef(null);

    const [code, setCode] = useState(
        `{"key": "value","key2": "value2","key3": "value3"}`
    );

    const [layout, setLayout] = useState({
        height: "60vh",
        width: "100%",
    });

    const files = [
        {
            name: "json1",
            language: "json",
            value: `{"id": "1","name": "Apple","color": "red"}`,
        },

        {
            name: "json2",
            language: "json",
            value: `{"id": "2","name": "Banana","color": "yellow"}`,
        },

        {
            name: "yml1",
            language: "yml",
            value: `--- 
id: 2 
name: Orange 
color: orange 
---`,
        },
    ];

    const [file, setFile] = useState(files[0]);

    useEffect(() => {
        handleResize();
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

    const [tab, setTab] = useState([files[0]]);

    const addTab = (list, clickType) => {
        if (clickType === "single") {
            console.log(clickType);
            const exists = tab.some((item) => item.name === list.name); // Check if the item with the same ID exists
            if (!exists) {
                setTab([...tab, list]); // Add the item if it doesn't already exist
            }
        } else {
            setTab([list]);
        }

        setFile(list);
    };

    return (
        <div className="listContainer">
            <div className="editorContainer">
                <div className="fileSelection">
                    {files.map((list, index) => (
                        <div
                            className={`fileItem ${
                                file.name === list.name ? "active" : ""
                            }`}
                            key={index}
                            onClick={() => addTab(list, "single")}
                            onDoubleClick={() => addTab(list, "double")}
                        >
                            {list.name}
                        </div>
                    ))}
                </div>

                <div className="editor">
                    <div className="tab">
                        {tab.map((list, index) => (
                            <div
                                className={`tabButton ${
                                    file.name === list.name ? "tabActive" : ""
                                }`}
                                onClick={() => setFile(list)}
                            >
                                <FaRegCircleXmark
                                    className="cancel mr-5"
                                    onClick={() => {
                                        setTab(
                                            tab.filter((_, i) => i !== index)
                                        );
                                    }}
                                />
                                <span className="tabName">{list.name}</span>
                            </div>
                        ))}
                    </div>

                    <div
                        className="resizable"
                        ref={parentDivRef}
                        onMouseMove={handleResize}
                    >
                        <Editor
                            height={layout.height}
                            width={layout.width}
                            path={file.name}
                            defaultLanguage={file.language}
                            defaultValue={file.value}
                            theme="light" // light / vs-dark
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZTPnDHCP;
