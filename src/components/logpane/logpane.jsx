import React, { useEffect, useState } from "react";
import { useLog } from "../../LogContext";
import "./logpane.scss";
import Time from "react-time-format";

function LogViewer() {
    const { log, clearLog } = useLog();
    const [logEntries, setLogEntries] = useState([]);

    useEffect(() => {
        console.log();

        if (Object.keys(log).length !== 0) {
            setLogEntries((prevLogEntries) => [log, ...prevLogEntries]);
        }
    }, [log]);

    const handelClearLog = () => {
        clearLog();
        setLogEntries([]);
    };

    return (
        <div style={{ width: "100%" }}>
            <div className="logPanel">
                <div className="grid-header-container">
                    <div className="grid-item"> # </div>
                    <div className="grid-item"> Time </div>
                    <div className="grid-item"> Task </div>
                    <div className="grid-item"> Status </div>
                </div>

                <div className="grid-body">
                    {logEntries.length > 0 &&
                        logEntries.map((entry, index) => (
                            <div className="grid-container" key={index}>
                                <div className="grid-item">
                                    {index}
                                </div>
                                <div className="grid-item">
                                    <Time
                                        value={entry.timestamp}
                                        format="DD-MM-YYYY hh:mm:ss"
                                    />
                                </div>
                                <div className="grid-item">{entry.result}</div>
                                <div className="grid-item">{entry.status}</div>
                            </div>
                        ))}
                </div>
            </div>

            <button className="clearLogBtn" onClick={handelClearLog}>
                Clear Log
            </button>
        </div>
    );
}

export default LogViewer;
