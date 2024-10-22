import React, { useRef, useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

export const ZTPnDHCP = () => {
    const parentDivRef = useRef(null);

    const [code, setCode] = useState(
        `{"key": "value","key2": "value2","key3": "value3"}`
    );

    const [layout, setLayout] = useState({
        height: "60vh",
        width: "100%",
    });

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
                <Editor
                    height={layout.height}
                    width={layout.width}
                    defaultLanguage="json"
                    defaultValue={code}
                    path={'../graphsNcharts/graph/CustomGraph.jsx'}
                    theme="light" // light / vs-dark
                />
            </div>
        </div>
    );
};

export default ZTPnDHCP;
