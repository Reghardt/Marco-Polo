import { Box, Button, Card, CardActions, CardContent, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function TabsExperiment()
{
    const [tabValue, setTabValue] = useState(0);



    function TabPanel(props: ITabPanelProps) {
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

      //not sure what this function does but include it as a SO answer said it has something to do with the compiler
      function tabProps(index: number) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }

    return(
        <Box>
            <Box>
              <Typography variant="h4" gutterBottom>Test</Typography>
                <Tabs value={tabValue} onChange={(_e, v) => (setTabValue(v))}>
                    <Tab label="Tab1" {...tabProps(0)}/>
                    <Tab label="Tab2" {...tabProps(1)}/>
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>

              <h1>Tab 1</h1>

            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <h1>Tab 2</h1>
   
            </TabPanel>
        </Box>
    )
}


