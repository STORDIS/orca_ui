import React, { createContext, useContext, useState } from "react";

const DisableConfigContext = createContext();

export const useDisableConfig = () => useContext(DisableConfigContext);

export const DataProviderConfig = ({ children }) => {
    const [disableConfig, setDisableConfig] = useState(false);

    return (
        <DisableConfigContext.Provider value={{ disableConfig, setDisableConfig }}>
            {children}
        </DisableConfigContext.Provider>
    );
};
