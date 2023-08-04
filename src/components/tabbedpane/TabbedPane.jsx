import React from "react";
import Navbar from "../navbar/Navbar"
import Sidebar from "../sidebar/Sidebar"
import "./tabbedPane.scss"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Datatable from "../../components/tabbedpane/Datatable";
import Deviceinfo from "../../components/tabbedpane/Deviceinfo";
import InterfaceDataTable from "../../components/tabbedpane/interfaceDataTable";
import PortChDataTable from "../../components/tabbedpane/portChDataTable";
import McLagDataTable from "../../components/tabbedpane/mclagDataTable";
import BGPTable from "../../components/tabbedpane/bgpTable";
import { useParams } from 'react-router-dom';
import { getAllDevicesURL } from "../../backend_rest_urls";
import axios from "axios";
import { useState, useEffect } from "react";
import PortGroupTable from "../../components/tabbedpane/portGroupTable";
import VlanTable from "../../components/tabbedpane/vlanTable";
import LogViewer from "../logpane/logpane";



const TabbedPane = () => {
    const { deviceIP } = useParams();
    const [tabValue, setTabValue] = React.useState(parseInt(localStorage.getItem('selectedTab')) !==null  ? parseInt(localStorage.getItem('selectedTab')) : 0);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        axios(getAllDevicesURL())
        .then((res) => {
            let data = res.data.map((element) => {
                return { value: element.mgt_ip, label: element.mgt_ip };
            });
            setDropdownOptions(data);
            setDataTable(res.data);
        })
        .catch((err) => console.log(err));
    }, []);

    const handleTabs = (event, val) => {
        setTabValue(val);
        localStorage.setItem('selectedTab', val.toString());
    };

    return(
        <div className='tabbedPane'>
            <Sidebar />
            <div className="tabbedPaneContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <div className="item">
                    Device details : <select value = { deviceIP } onChange={(e) => window.location.pathname = `/devices/${e.target.value}`}>
                        { dropdownOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.value}
                            </option>
                        ))}
                    </select>
                    </div>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabValue} onChange={handleTabs}>
                                    <Tab label="Device Info"/>
                                    <Tab label="Interfaces" />
                                    <Tab label="PortChannels" />
                                    <Tab label="MCLAGs" />
                                    <Tab label="BGP" />
                                    <Tab label="Port Groups" />
                                    <Tab label="VLANs" />
                                </Tabs>
                            </Box>
                            {/* <TabPanel tabValue={tabValue} index={0}>
                                <Datatable rows={1} columns={2} isTabbedPane={true} selectedDeviceIp={deviceIP}/>
                            </TabPanel> */}
                            <TabPanel tabValue={tabValue} index={0}>
                                <Deviceinfo columns={2} isTabbedPane={true} selectedDeviceIp={deviceIP}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={1}>
                                <InterfaceDataTable selectedDeviceIp={deviceIP} />
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={2}>
                                <PortChDataTable selectedDeviceIp={deviceIP}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={3}>
                                <McLagDataTable selectedDeviceIp={deviceIP}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={4}>
                                <BGPTable selectedDeviceIp={deviceIP}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={5}>
                                <PortGroupTable selectedDeviceIp={deviceIP}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={6}>
                                <VlanTable selectedDeviceIp={deviceIP}/>
                            </TabPanel>
                        </Box>

                       
                    </div>
                    <div className="right"></div>
                    <div className="bottom"></div>   
                    </div>
                <LogViewer/>
            </div>
        </div>
    )
}

const TabPanel = (props) => {
    const {children, tabValue, index} = props;
    return(
        <div>
        {
            tabValue === index &&  (<h5>{children}</h5>)
            
        }
        </div>
    )

}

export default TabbedPane