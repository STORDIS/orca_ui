import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import Deviceinfo from "../../components/tabbedpane/Deviceinfo";
import InterfaceDataTable from "../../components/tabbedpane/interfaces/interfaceDataTable";
import PortChDataTable from "../../components/tabbedpane/portchannel/portChDataTable";
import McLagDataTable from "../../components/tabbedpane/mclag/mclagDataTable";
import BGPTable from "../../components/tabbedpane/bgp/bgpTable";
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

import { getIsStaff } from "./datatablesourse";

const TabbedPane = () => {
    const instance = interceptor();

    const { deviceIP } = useParams();
    const [tabValue, setTabValue] = React.useState(
        parseInt(secureLocalStorage.getItem("selectedTab")) !== null
            ? parseInt(secureLocalStorage.getItem("selectedTab"))
            : 0
    );
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [undoChanges, setUndoChanges] = useState(false);

    const { disableConfig } = useDisableConfig();

    useEffect(() => {
        if (!secureLocalStorage.getItem("selectedTab")) {
            setTabValue(0);
            secureLocalStorage.setItem("selectedTab", tabValue.toString());
        }

        instance(getAllDevicesURL())
            .then((res) => {
                let data = res.data.map((element) => {
                    return { value: element.mgt_ip, label: element.mgt_ip };
                });
                setDropdownOptions(data);
            })
            .catch((err) => console.log(err));
    }, [disableConfig, tabValue]);

    const handleTabs = (event, val) => {
        setTabValue(val);
        secureLocalStorage.setItem("selectedTab", val.toString());
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
        <div className="zoom">
            <div className="listContainer">
                Device :
                <select value={deviceIP} onChange={handleDeviceChange}>
                    {dropdownOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.value}
                        </option>
                    ))}
                </select>
                &nbsp; &nbsp;
                <button type="button" disabled={!getIsStaff()} onClick={onUndo}>
                    Undo Changes
                </button>
            </div>
            <div className="listContainer ">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={tabValue} onChange={handleTabs}>
                        <Tab label="Device Info" />
                        <Tab label="Interfaces" />
                        <Tab label="PortChannels" />
                        <Tab label="MCLAGs" />
                        <Tab label="BGP" />
                        <Tab label="Port Groups" />
                        <Tab label="VLANs" />
                    </Tabs>
                </Box>
                {tabValue === 0 && (
                    <div className="resizable" tabValue={tabValue} index={0}>
                        <Deviceinfo
                            columns={2}
                            isTabbedPane={true}
                            selectedDeviceIp={deviceIP}
                        />
                    </div>
                )}
                {tabValue === 1 && (
                    <div className="resizable" tabValue={tabValue} index={1}>
                        <InterfaceDataTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabValue === 2 && (
                    <div className="resizable" tabValue={tabValue} index={2}>
                        <PortChDataTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabValue === 3 && (
                    <div className="resizable" tabValue={tabValue} index={3}>
                        <McLagDataTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabValue === 4 && (
                    <div className="resizable" tabValue={tabValue} index={4}>
                        <BGPTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabValue === 5 && (
                    <div className="resizable" tabValue={tabValue} index={5}>
                        <PortGroupTable
                            selectedDeviceIp={deviceIP}
                            refresh={undoChanges}
                            reset={() => setUndoChanges(false)}
                        />
                    </div>
                )}
                {tabValue === 6 && (
                    <div className="resizable" tabValue={tabValue} index={6}>
                        <VlanTable
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

// const div = (props) => {
//     const { children, tabValue, index } = props;
//     return <div className="">{tabValue === index && <h5>{children}</h5>}</div>;
// };

export default TabbedPane;
