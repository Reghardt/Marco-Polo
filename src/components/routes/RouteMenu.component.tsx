import { Box, Button, Card, CardActions, CardContent, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getServerUrl } from "../../services/server.service";
import { RJobID, RWorkspaceID } from "../../state/globalstate";
import RouteCreator from "./RouteCreator.component";

interface IJobData {
  jobName: string;
  jobId: string
}


export default function RouteMenu()
{
    const [tabIdx, setTabIdx] = useState(0);

    const [workspaceId, setWorkspaceId] = useRecoilState(RWorkspaceID)
    const [jobId, setJobId] = useRecoilState(RJobID)
    const [listOfJobs, setListOfJobs] = useState<IJobData[]>([])

    let navigate = useNavigate();

    useEffect(() => {
      getAllRoutes()
    }, [])

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

    function getAllRoutes()
    {
      axios.post(getServerUrl() + "/job/list",
        {
            workspaceId: workspaceId,
        },
        {
          //add bearer
        }).then(res => {
            console.log(res.data)
            setListOfJobs(res.data)
        }).catch(err => {
            console.error(err)
        })
    }

    function openJob(id: string)
    {
      setJobId({jobId: id, shouldFetch: true})
      navigate("/jobEditor", {replace: true})
    }

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
                {
                  listOfJobs.map((elem, idx) => {
                    return <div style={{padding: "10px"}} key={idx}>
                      <Card sx={{ minWidth: 275 }}>
                          <CardContent>
                              <Typography variant="h5" component="div">{elem.jobName}</Typography>
                          </CardContent>
                          <CardActions>
                              {/* C */}
                              <Button size="small" onClick={() => {openJob(elem.jobId)}}>Open</Button>
                          </CardActions>
                      </Card>
                  </div>
                  })
                }


            </TabPanel>
            <TabPanel value={tabIdx} index={1}>
                <RouteCreator/>
   
            </TabPanel>
        </Box>
    )
}


