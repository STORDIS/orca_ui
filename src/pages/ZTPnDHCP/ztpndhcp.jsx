import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./ztpndhcp.scss";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import { ListItem } from "@mui/material";

export const ZTPnDHCP = () => {
    const parentDivRef = useRef(null);
    const fileInputRef = useRef(null);

    const [layout, setLayout] = useState({
        height: "60vh",
        width: "100%",
    });

    const [files, setFiles] = useState([
        {
            id: 1,
            name: "json1",
            language: "json",
            value: `{"id": "1","fruitName": "Apple","color": "red"}`,
            status: "saved",
        },
        {
            id: 2,
            name: "json2",
            language: "json",
            value: `{"id": "2","fruitName": "Banana","color": "yellow"}`,
            status: "saved",
        },
        {
            id: 3,
            name: "yml1",
            language: "yml",
            value: `--- 
id: 2 
fruitName: Orange 
color: orange 
---`,
            status: "saved",
        },
    ]);

    const [file, setFile] = useState({
        id: 0,
        name: "default",
        language: "txt",
        value: "Select a file",
        status: "saved",
    });
    const [tab, setTab] = useState([]);

    // Keep track of unsaved changes
    const hasUnsavedChanges = tab.some((item) => item.status === "unsaved");

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);

        const handleBeforeUnload = (event) => {
            console.log(event);
            if (hasUnsavedChanges) {
                const confirmationMessage =
                    "You have unsaved changes. Are you sure you want to leave?";
                event.returnValue = confirmationMessage; // Gecko + WebKit
                return confirmationMessage; // Webkit, Safari, Chrome
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("resize", handleResize);
        };
    }, [tab]);

    const handleResize = () => {
        if (parentDivRef.current) {
            setLayout({
                height: parentDivRef.current.offsetHeight,
                width: parentDivRef.current.offsetWidth,
            });
        }
    };

    const addTab = (list, clickType) => {
        if (clickType === "single") {
            const exists = tab.some((item) => item.id === list.id);
            if (!exists) {
                setTab([...tab, list]);
            }
        } else {
            setTab([list]);
        }

        setFile(list);
    };

    const removeTab = (list) => {
        if (list.status === "saved") {
            const updatedTab = tab.filter((item) => item.id !== list.id);
            if (updatedTab.length === 0) {
                setTab([]);
                setFile({
                    id: 0,
                    name: "default",
                    language: "txt",
                    value: "Select a file",
                });
            } else {
                setTab(updatedTab);
                setFile(updatedTab[0]);
            }
        } else {
            alert("Unsaved changes, cannot remove. Please save.");
        }
    };

    const editorChange = (e, id) => {
        const updatedTab = tab.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    value: e,
                    status: "unsaved",
                };
            }
            return item;
        });
        setTab(updatedTab);
    };

    const save = (list) => {
        const updatedTab = tab.map((item) => {
            if (item.id === list.id) {
                return {
                    ...item,
                    status: "saved",
                };
            }
            return item;
        });
        setTab(updatedTab);
    };

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        console.log(uploadedFile);
        console.log("type", uploadedFile.type.split("/")[1]);
        console.log("name", uploadedFile.name);

        if (uploadedFile) {
            const reader = new FileReader();
            let fileText = "";
            reader.onload = (e) => {
                fileText = e.target.result;
                console.log("text", fileText);

                setFiles([
                    ...files,
                    {
                        id: files.length + 1,
                        name: uploadedFile.name,
                        language: uploadedFile.type.split("/")[1],
                        value: fileText,
                        status: "unsaved",
                    },
                ]);

                setFile({
                    id: files.length + 1,
                    name: uploadedFile.name,
                    language: uploadedFile.type.split("/")[1],
                    value: fileText,
                    status: "unsaved",
                });

                setTab([
                    ...tab,
                    {
                        id: files.length + 1,
                        name: uploadedFile.name,
                        language: uploadedFile.type.split("/")[1],
                        value: fileText,
                        status: "unsaved",
                    },
                ]);
            };
            reader.readAsText(uploadedFile);
        }
    };

    const removeFile = (list) => {
        const updatedFiles = files.filter((item) => item.id !== list.id);
        setFiles(updatedFiles);

        const updatedTab = tab.filter((item) => item.id !== list.id);
        if (updatedTab.length === 0) {
            setTab([]);
            setFile({
                id: 0,
                name: "default",
                language: "txt",
                value: "Select a file",
            });
        } else {
            setTab(updatedTab);
            setFile(updatedTab[0]);
        }
    };

    const [popover, setPopover] = useState({
        visible: false,
        x: 0,
        y: 0,
        message: "",
    });

    const handleRightClick = (event, list) => {
        event.preventDefault();
        console.log(list);
        setPopover({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            file: list,
        });
    };

    return (
        <div
            className="listContainer"
            onClick={() => setPopover({ ...popover, visible: false })}
        >
            <div className="pl-10 ">
                <div className="form-wrapper" style={{ alignItems: "center" }}>
                    <div className="form-field w-auto">
                        <label htmlFor="">DHCP server Address :</label>
                    </div>
                    <div className="form-field w-60">
                        <input type="text" placeholder="" />
                    </div>
                </div>
                <div className="form-wrapper" style={{ alignItems: "center" }}>
                    <div className="form-field w-auto">
                        <label htmlFor="">User Name :</label>
                    </div>
                    <div className="form-field w-25">
                        <input type="text" placeholder="" />
                    </div>

                    <div className="form-field w-auto ml-25">
                        <label htmlFor="">Password :</label>
                    </div>
                    <div className="form-field w-25">
                        <input type="password" placeholder="" />
                    </div>
                </div>
            </div>

            <div className="editorContainer">
                <div className="fileSelection">
                    <div className="fileHeader">File list</div>

                    {files.map((list, index) => (
                        <div
                            className={`fileItem ${
                                file?.name === list?.name ? "active" : ""
                            }`}
                            key={index}
                            onClick={() => addTab(list, "single")}
                            onDoubleClick={() => addTab(list, "double")}
                            onContextMenu={(e) => handleRightClick(e, list)}
                        >
                            {list?.name}
                        </div>
                    ))}
                    <div className="fileBottomSection">
                        <button
                            onClick={() => {
                                fileInputRef.current.click();
                            }}
                        >
                            Add File
                            <FaFolderPlus className="ml-5" />
                        </button>
                        <input
                            type="file"
                            // multiple
                            accept=".txt, .yml, .json"
                            ref={fileInputRef}
                            style={{ display: "none" }} // Hide the input element
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="editor">
                    <div className="tab">
                        {tab.map((list, index) => (
                            <div
                                className={`tabButton ${
                                    file.name === list.name ? "tabActive" : ""
                                }`}
                                key={index}
                            >
                                <div className="tabName">
                                    <FaRegCircleXmark
                                        className="cancel mr-5"
                                        onClick={() => removeTab(list)}
                                    />
                                    <div onClick={() => setFile(list)}>
                                        {list.name}
                                    </div>
                                </div>
                                {list.status === "unsaved" && (
                                    <div onClick={() => setFile(list)}>
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
                            onChange={(e) => editorChange(e, file.id)}
                        />
                    </div>

                    <div className="editorBottomSection">
                        <button
                            className="addFileButton"
                            onClick={() => save(file)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Popover box */}
            {popover.visible && (
                <div
                    className="popover"
                    style={{
                        position: "absolute",
                        top: popover.y,
                        left: popover.x,
                        backgroundColor: "white",
                        border: "1px solid black",
                        zIndex: 1000,
                        width: "125px",
                    }}
                >
                    <ul>
                        <li onClick={() => removeFile(popover.file)}>
                            remove file
                        </li>
                        <li onClick={() => save(popover.file)}>Save file</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ZTPnDHCP;
