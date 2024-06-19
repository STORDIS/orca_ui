import React, { createContext, useContext, useState } from "react";
import { getIsStaff } from "../components/tabbedpane/datatablesourse";

const DisableTableContext = createContext();

export const useDisableTable = () => useContext(DisableTableContext);

export const DataProviderTable = ({ children }) => {
    const [disableTable, setDisableTable] = useState(!getIsStaff());

    return (
        <DisableTableContext.Provider
            value={{ disableTable, setDisableTable }}
        >
            {children}
        </DisableTableContext.Provider>
    );
};
