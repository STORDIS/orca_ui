import React from "react";
import "./tabbedPane.scss";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Deviceinfo from "../../components/tabbedpane/Deviceinfo";
import InterfaceDataTable from "../../components/tabbedpane/interfaceDataTable";
import PortChDataTable from "../../components/tabbedpane/portchannel/portChDataTable";
import McLagDataTable from "../../components/tabbedpane/mclag/mclagDataTable";
import BGPTable from "../../components/tabbedpane/bgp/bgpTable";
import { useParams } from "react-router-dom";
import { getAllDevicesURL } from "../../backend_rest_urls";
import { useState, useEffect } from "react";
import PortGroupTable from "../../components/tabbedpane/portGroupTable";
import VlanTable from "../../components/tabbedpane/vlanTable";
import "../../pages/home/home.scss";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import interceptor from "../../interceptor";
import { useDisableConfig } from "../../utils/dissableConfigContext";

const TabbedPane = () => {
    const instance = interceptor();

    const { deviceIP } = useParams();
    const [tabValue, setTabValue] = React.useState(
        parseInt(secureLocalStorage.getItem("selectedTab")) !== null
            ? parseInt(secureLocalStorage.getItem("selectedTab"))
            : 0
    );
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [refresh, setRefresh] = useState(false);

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
        console.log("onundo", tabValue);
        setRefresh(true);
    };

    const navigate = useNavigate();

    const handleDeviceChange = (event) => {
        navigate("/devices/" + event.target.value);
        setRefresh(true);
    };

    return (
        <div>
            <div className="listContainer">
                Device :{" "}
                <select value={deviceIP} onChange={handleDeviceChange}>
                    {dropdownOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.value}
                        </option>
                    ))}
                </select>
                &nbsp; &nbsp;
                <button type="button" onClick={onUndo}>
                    Undo Changes
                </button>
            </div>
            <div className="listContainer">
                <Box sx={{ width: "100%" }}>
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
                    <TabPanel tabValue={tabValue} index={0}>
                        <Deviceinfo
                            columns={2}
                            isTabbedPane={true}
                            selectedDeviceIp={deviceIP}
                        />
                    </TabPanel>
                    <TabPanel tabValue={tabValue} index={1}>
                        <InterfaceDataTable selectedDeviceIp={deviceIP} />
                    </TabPanel>
                    <TabPanel tabValue={tabValue} index={2}>
                        <PortChDataTable selectedDeviceIp={deviceIP} />
                    </TabPanel>
                    <TabPanel tabValue={tabValue} index={3}>
                        <McLagDataTable selectedDeviceIp={deviceIP} />
                    </TabPanel>
                    <TabPanel tabValue={tabValue} index={4}>
                        <BGPTable selectedDeviceIp={deviceIP} />
                    </TabPanel>
                    <TabPanel tabValue={tabValue} index={5}>
                        <PortGroupTable selectedDeviceIp={deviceIP} />
                    </TabPanel>
                    <TabPanel tabValue={tabValue} index={6}>
                        <VlanTable selectedDeviceIp={deviceIP} />
                    </TabPanel>
                </Box>
            </div>
        </div>
    );
};

const TabPanel = (props) => {
    const { children, tabValue, index } = props;
    return <div>{tabValue === index && <h5>{children}</h5>}</div>;
};

export default TabbedPane;
