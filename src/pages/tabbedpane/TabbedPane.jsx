import React from "react";
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./tabbedPane.scss"
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Datatable from "../../components/datatable/Datatable"

const TabbedPane = () => {

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
                    <h1 className="title">Select an option for that device</h1>
                        <div className="item">
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabValue} onChange={handleTabs}>
                                    <Tab label="Device Info"/>
                                    <Tab label="Interface Table" />
                                    <Tab label="Port Channel Table" />
                                    <Tab label="MC LAG" />
                                </Tabs>
                            </Box>
                            <TabPanel tabValue={tabValue} index={0}>
                                <Datatable/>
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={1}>
                                Interface Table
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={2}>
                                Port Channel Table
                            </TabPanel>
                            <TabPanel tabValue={tabValue} index={3}>
                                MC LAG
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