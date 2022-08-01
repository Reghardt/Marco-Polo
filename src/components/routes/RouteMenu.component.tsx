import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import RouteCreator from "./RouteCreator.component";


export default function RouteMenu()
{
    const [tabIdx, setTabIdx] = useState(0);

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
      }

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            hidden={!(value === index)}
            id={`simple-tabpanel-${index}`} //TODO give everything in the app a unique id based on this approach, not just a number
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
                {children}
          </div>
        );
      }

      function a11yProps(index: number) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }

    function handleChange(index: number){
        console.log("change")
        setTabIdx(index);
    };

    return(
        <Box>
            <Box>
                <Tabs value={tabIdx} onChange={(_e, v) => (handleChange(v))}>
                    <Tab label = "Current Jobs" {...a11yProps(0)}/>
                    <Tab label = "New Job" {...a11yProps(1)}/>
                </Tabs>
            </Box>

            <TabPanel value={tabIdx} index={0}>

                <p>List of current and active jobs -- TODO</p>


            </TabPanel>
            <TabPanel value={tabIdx} index={1}>
                <RouteCreator/>
   
            </TabPanel>
        </Box>
    )
}


