import React, { useEffect, useState } from "react";

import useStoreConfig from "../../../utils/configStore";
import { putStpDataCommon } from "./stpDataTable";
import useStoreLogs from "../../../utils/store";

const StpVlanForm = ({ onSubmit, selectedDeviceIp, onClose }) => {
    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    useEffect(() => {}, []);

    return (
        <div>
            <p>addStpVlanForm</p>
        </div>
    );
};
export default StpVlanForm;
