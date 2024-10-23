import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./ztpndhcp.scss";
import { FaRegCircleXmark } from "react-icons/fa6";
// import { FaCircle } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";

export const ZTPnDHCP = () => {
    const parentDivRef = useRef(null);

    const [layout, setLayout] = useState({
        height: "60vh",
        width: "100%",
    });

    const files = [
        {
            name: "json1",
            language: "json",
            value: `{"id": "1","name": "Apple","color": "red"}`,
            status: "saved",
        },

        {
            name: "json2",
            language: "json",
            value: `{"id": "2","name": "Banana","color": "yellow"}`,
            status: "saved",
        },

        {
            name: "yml1",
            language: "yml",
            value: `--- 
id: 2 
name: Orange 
color: orange 
---`,
            status: "saved",
        },
    ];

    const [file, setFile] = useState({
        name: "default",
        language: "txt",
        value: "Select a file",
        status: "saved",
    });

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

    const [tab, setTab] = useState([]);

    const addTab = (list, clickType) => {
        if (clickType === "single") {
            const exists = tab.some((item) => item.name === list.name); // Check if the item with the same ID exists
            if (!exists) {
                setTab([...tab, list]); // Add the item if it doesn't already exist
            }
        } else {
            setTab([list]);
        }

        setFile(list);
    };

    const remove = (list) => {
        // setTab(tab.filter((item) => item.name !== list.name));

        if (list.status === "saved") {
            const updatedTab = tab.filter((item) => item.name !== list.name);

            if (updatedTab.length === 0) {
                setTab([]);
                setFile({
                    name: "default",
                    language: "txt",
                    value: "Select a file",
                });
            } else {
                setTab(updatedTab);
                setFile(updatedTab[0]);
            }
        } else {
            alert("unsaved changes");
        }
    };

    const editorChange = (e, fileName) => {
        const updatedTab = tab.map((item) => {
            if (item.name === fileName) {
                return {
                    ...item,
                    value: e,
                    status: "unsaved",
                };
            }
            return item;
        });
        // setIsSaved(false);
        setTab(updatedTab);
    };

    const save = (list) => {
        const updatedTab = tab.map((item) => {
            if (item.name === list.name) {
                return {
                    ...item,
                    status: "saved",
                };
            }
            return item;
        });
        // setIsSaved(true);

        setTab(updatedTab);
    };

    return (
        <div className="listContainer">
            <div className="pl-10 ">
                <div
                    className="form-wrapper"
                    style={{
                        alignItems: "center",
                    }}
                >
                    <div className="form-field w-25">
                        <label htmlFor="">DHCP server credentials :</label>
                    </div>
                    <div className="form-field w-75">
                        <input type="text" placeholder="" />
                    </div>
                </div>
            </div>

            <div className="editorContainer">
                <div className="fileSelection">
                    {files.map((list, index) => (
                        <div
                            className={`fileItem ${
                                file?.name === list?.name ? "active" : ""
                            }`}
                            key={index}
                            onClick={() => addTab(list, "single")}
                            onDoubleClick={() => addTab(list, "double")}
                        >
                            {list?.name}
                        </div>
                    ))}
                    <div className="bottomSection">
                        <button
                            className="addFileButton"
                            onClick={() => save(file)}
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="editor">
                    <div className="tab">
                        {tab.map((list, index) => (
                            <div
                                className={`tabButton ${
                                    file.name === list.name ? "tabActive" : ""
                                }`}
                            >
                                <div className="tabName">
                                    <FaRegCircleXmark
                                        className="cancel mr-5"
                                        onClick={() => {
                                            remove(list);
                                        }}
                                    />
                                    <div
                                        onClick={() => {
                                            setFile(list);
                                        }}
                                    >
                                        {list.name}
                                    </div>
                                </div>
                                {list.status === "unsaved" && (
                                    <div
                                        onClick={() => {
                                            setFile(list);
                                        }}
                                    >
                                        <FaCircle />
                                    </div>
                                )}
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
                            language={file.language}
                            value={file.value}
                            defaultLanguage={"txt"}
                            defaultValue={"Select a file"}
                            theme="light" // light / vs-dark
                            onChange={(e) => editorChange(e, file.name)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZTPnDHCP;
