import React, { createContext, useContext, useState } from "react";
import { getIsStaff } from "../components/tabbedpane/datatablesourse";

const DisableConfigContext = createContext();

export const useDisableConfig = () => useContext(DisableConfigContext);

export const DataProviderConfig = ({ children }) => {
    const [disableConfig, setDisableConfig] = useState(!getIsStaff());

    return (
        <DisableConfigContext.Provider
            value={{ disableConfig, setDisableConfig }}
        >
            {children}
        </DisableConfigContext.Provider>
    );
};
