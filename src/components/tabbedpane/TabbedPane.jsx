import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import Deviceinfo from "../../components/tabbedpane/Deviceinfo";
import InterfaceDataTable from "../../components/tabbedpane/interfaces/interfaceDataTable";
import PortChDataTable from "../../components/tabbedpane/portchannel/portChDataTable";
import McLagDataTable from "../../components/tabbedpane/mclag/mclagDataTable";
import BGPTable from "../../components/tabbedpane/bgp/bgpTable";
import StpDataTable from "./stp/stpDataTable";

import { useParams } from "react-router-dom";
import { getAllDevicesURL } from "../../utils/backend_rest_urls";
import { useState, useEffect } from "react";
import PortGroupTable from "./portgroup/portGroupTable";
import VlanTable from "./vlan/vlanTable";
import "../../pages/home/home.scss";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import interceptor from "../../utils/interceptor";
import { useDisableConfig } from "../../utils/dissableConfigContext";

const TabbedPane = () => {
    const instance = interceptor();

    const { deviceIP } = useParams();
    const [tabvalue, settabvalue] = React.useState(
        parseInt(secureLocalStorage.getItem("selectedTab")) !== null
            ? parseInt(secureLocalStorage.getItem("selectedTab"))
            : 0
    );
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [undoChanges, setUndoChanges] = useState(false);

    const { disableConfig } = useDisableConfig();

    useEffect(() => {
        if (!secureLocalStorage.getItem("selectedTab")) {
            settabvalue(0);
            secureLocalStorage.setItem("selectedTab", tabvalue);
        }

        instance(getAllDevicesURL())
            .then((res) => {
                let data = res.data.map((element) => {
                    return { value: element.mgt_ip, label: element.mgt_ip };
                });
                setDropdownOptions(data);
            })
            .catch((err) => console.log(err));
    }, [disableConfig, tabvalue]);

    const handleTabs = (event, val) => {
        settabvalue(val);
        secureLocalStorage.setItem("selectedTab", val);
    };

    const onUndo = (event) => {
        setUndoChanges(true);
    };

    const navigate = useNavigate();

    const handleDeviceChange = (event) => {
        navigate("/devices/" + event.target.value);
        setUndoChanges(true);
    };

    return (
        <div>
            <div className="listContainer">
                Device :
                <select
                    className="ml-10"
                    value={deviceIP}
                    onChange={handleDeviceChange}
                >
                    {dropdownOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.value}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className="btnColor ml-10"
                    onClick={onUndo}
                >
                    Undo Changes
                </button>
            </div>
            <div className="listContainer ">
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Tabs
                        value={tabvalue}
                        onChange={handleTabs}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Device Info" />
                        <Tab label="Interfaces" />
                        <Tab label="PortChannels" />
                        <Tab label="MCLAGs" />
                        <Tab label="BGP" />
                        <Tab label="Port Groups" />
                        <Tab label="VLANs" />
                        <Tab label="STP" />
                    </Tabs>
                </Box>
                {tabvalue === 0 && (
                    <div className="resizable" tabvalue={tabvalue} index={0}>
                        <Deviceinfo
                            columns={2}
                            isTabbedPane={true}
                            selectedDeviceIp={deviceIP}
                        />
                    </div>
                )}
                {tabvalue === 1 && (
                    <div className="resizable" tabvalue={tabvalue} index={1}>
                        <InterfaceDataTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabvalue === 2 && (
                    <div className="resizable" tabvalue={tabvalue} index={2}>
                        <PortChDataTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabvalue === 3 && (
                    <div className="resizable" tabvalue={tabvalue} index={3}>
                        <McLagDataTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabvalue === 4 && (
                    <div className="resizable" tabvalue={tabvalue} index={4}>
                        <BGPTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabvalue === 5 && (
                    <div className="resizable" tabvalue={tabvalue} index={5}>
                        <PortGroupTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabvalue === 6 && (
                    <div className="resizable" tabvalue={tabvalue} index={6}>
                        <VlanTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabvalue === 7 && (
                    <div className="resizable" tabvalue={tabvalue} index={6}>
                        <StpDataTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TabbedPane;
