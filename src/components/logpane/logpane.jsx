// import { useState, useEffect } from "react";

// const LogViewer = (props) => {
//   const [text, setText] = useState("");
//   const log_txt = props.log;
//   useEffect(() => {
//     addLogMessage(log_txt);
//   }, [log_txt]);

//   const addLogMessage = (message) => {
//     setText((prevLogs) => [message + "\n" + prevLogs]);
//   };

//   const handleTextChange = (event) => {
//     setText(event.target.value);
//   };

//   const clearLog = () => {
//     setText("");
//     props.setLog([]);
//   };

//   return (
//     <div>
//       <textarea
//         rows={5}
//         style={{ width: "100%" }}
//         value={text}
//         onChange={handleTextChange}
//         readOnly
//       />
//       <br />
//       <button onClick={clearLog}>clearLog</button>
//     </div>
//   );
// };

// export default LogViewer;

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
