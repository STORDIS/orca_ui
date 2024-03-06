// DataContext.js
import React, { createContext, useContext, useState } from "react";

const LogContext = createContext();

export const useLog = () => useContext(LogContext);

export const DataProvider = ({ children }) => {
    const [log, setLog] = useState({});

    const clearLog = () => {
        setLog({});
    };

    return (
        <LogContext.Provider value={{ log, setLog, clearLog }}>
            {children}
        </LogContext.Provider>
    );
};
