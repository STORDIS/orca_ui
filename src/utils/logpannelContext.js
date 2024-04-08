// DataContext.js
import React, { createContext, useContext, useState } from "react";

const LogContext = createContext();

export const useLog = () => useContext(LogContext);

export const DataProvider = ({ children }) => {
    const [log, setLog] = useState(false);

    return (
        <LogContext.Provider value={{ log, setLog }}>
            {children}
        </LogContext.Provider>
    );
};
