import { Box, Button, Card, CardActions, CardContent, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";



interface IJobData {
  jobName: string;
  jobId: string
}


export default function TabsExperiment()
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
              <h1> </h1>
              <Typography variant="h4" gutterBottom>Test</Typography>
                <Tabs value={tabIdx} onChange={(_e, v) => (handleChange(v))}>
                    <Tab label = "Tab1" {...a11yProps(0)}/>
                    <Tab label = "Tab2" {...a11yProps(1)}/>
                </Tabs>
            </Box>

            <TabPanel value={tabIdx} index={0}>

              <h1>Tab 1</h1>
            </TabPanel>
            <TabPanel value={tabIdx} index={1}>
              <h1>Tab 2</h1>
   
            </TabPanel>
        </Box>
    )
}


