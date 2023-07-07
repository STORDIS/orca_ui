import React from "react";
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./tabbedPane.scss"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Datatable from "../../components/datatable/Datatable";
import InterfaceDataTable from "../../components/interfaceDataTable/interfaceDataTable";
import PortChDataTable from "../../components/portChDataTable/portChDataTable";
import McLagDataTable from "../../components/mclagDataTable/mclagDataTable";
import BGPTable from "../../components/bgpTable/bgpTable";
import { Link, useParams } from 'react-router-dom';
import { getAllDevicesURL } from "../../backend_rest_urls";
import axios from "axios";
import { useState, useEffect } from "react";


const TabbedPane = (props) => {
    const { deviceIP } = useParams();
    const [tabValue, setTabValue] = React.useState(0);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        axios(getAllDevicesURL())
          .then((res) => {
            console.log("response", res.data);
            let data = res.data.map((element) => {
              return { value: element.mgt_ip, label: element.mgt_ip };
            });
            console.log("Data",data);
            setDropdownOptions(data);
            setDataTable(res.data);
          })
          .catch((err) => console.log(err));
      }, []);

    const handleTabs = (event, val) => {
        setTabValue(val);
    };

    return(
        <div className='tabbedPane'>
            <Sidebar />
            <div className="tabbedPaneContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                    <div className="item">
                    Device details : <select value={deviceIP} onChange={(e) => window.location.pathname = `/devices/${e.target.value}`}>
                                {dropdownOptions.map((option)=> (
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
                                </Tabs>
                            </Box>
                            <TabPanel tabValue={tabValue} index={0}>
                                <Datatable rows={1} columns={2} isTabbedPane={true} selectedItemId={deviceIP}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={1}>
                                <InterfaceDataTable selectedItemId={deviceIP} />
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={2}>
                                <PortChDataTable selectedItemId={deviceIP}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={3}>
                                <McLagDataTable selectedItemId={deviceIP}/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={4}>
                                <BGPTable selectedItemId={deviceIP}/>
                            </TabPanel>
                        </Box>

                        
                    </div>
                    <div className="right"></div>
                    <div className="bottom"></div>   
                    </div>
            </div>
        </div>
    )
}

const TabPanel = (props) => {
    const {children, tabValue, index} = props;
    return(
        <div>
        {
            tabValue === index &&  (<h1>{children}</h1>)
            
        }
        </div>
    )

}

export default TabbedPane