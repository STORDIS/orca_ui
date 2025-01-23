import React, { useEffect, useState } from "react";
import interceptor from "../../../utils/interceptor";

import useStoreConfig from "../../../utils/configStore";

import useStoreLogs from "../../../utils/store";

import { getIpAvailableCommon } from "../../../pages/IPAM/IPAM";

const VlanIpForm = ({ onClose, onSubmit, selectedDeviceIp, inputData }) => {
  const instance = interceptor();
  const [ipAvailable, setIpAvailable] = useState([]);
  const [newIp, setNewIp] = useState("");
  const [newIpPrefix, setNewIpPrefix] = useState(1);
  
  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  useEffect(() => {
    getIpAvailableCommon().then((res) => {
      setIpAvailable(res);
    });
  }, []);

  const handleIpChange = (e) => {
    setNewIp(e.target.value);
  };

  const handleIpPrefixChange = (e) => {
    setNewIpPrefix(e.target.value);
  };

  return <div></div>;
};

export default VlanIpForm;
