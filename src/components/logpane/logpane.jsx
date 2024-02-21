import React, { useEffect, useState } from "react";
import { useLog } from "../../LogContext";

function LogViewer() {
    const { log, clearLog } = useLog();
    const [displayedLog, setDisplayedLog] = useState(log);

    useEffect(() => {
        const newLog = log && displayedLog ? `\n${log}` : log;
        setDisplayedLog((prevLog) => prevLog + newLog);
    }, [log]);

    const handelClearLog = () => {
        clearLog();
        setDisplayedLog("");
    };

    return (
        <div>
            <textarea
                rows={5}
                style={{ width: "100%" }}
                value={displayedLog}
                readOnly
            />
            <br />
            <button onClick={handelClearLog}>clearLog</button>
        </div>
    );
}

export default LogViewer;
