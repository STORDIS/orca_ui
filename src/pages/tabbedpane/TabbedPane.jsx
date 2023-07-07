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
import { useParams } from 'react-router-dom';


const TabbedPane = (props) => {
    const { deviceIP } = useParams();
    const [tabValue, setTabValue] = React.useState(0);
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
                    <h1 className="title">Device details : {deviceIP}</h1>
                        <div className="item">
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