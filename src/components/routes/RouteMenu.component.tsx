
import styled from "@emotion/styled";
import { Box, Button, Card, CardActions, CardContent, IconButton, Paper, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { getServerUrl } from "../../services/server.service";
import { RSBearerToken, RSJobID, RSWorkspaceID } from "../../state/globalstate";
import RouteCreator from "./RouteCreator.component";

interface IJobData {
  jobName: string;
  jobId: string
}

const RouteMenuStyle = styled.div`
  .hoverDiv{
    &:hover {
      cursor: pointer;
      background-color: grey;
      .childHoverStyle{
        background-color: rebeccapurple;
      }
    }
  }
`


export default function RouteMenu()
{
    const [workspaceId, setWorkspaceId] = useRecoilState(RSWorkspaceID)
    const [workspaceName, setWorkspaceName] = useState("")
    const R_bearer = useRecoilValue(RSBearerToken)

    let navigate = useNavigate();

    useEffect(() => {
      getInfoAboutWorkspace()
    }, [])

    function getInfoAboutWorkspace()
    {
      axios.post(getServerUrl() + "/job/info",
        {
            workspaceId: workspaceId,
        },
        {
          headers: {authorization: R_bearer}
        }).then(res => {
            console.log(res)
            setWorkspaceName(res.data.workspaceName)
        }).catch(err => {
            console.error(err)
        })

    }

    function createPaperRoute()
    {
      navigate("/jobEditor", {replace: true})
    }

    return(
        <RouteMenuStyle>
          <Typography variant="h4" gutterBottom sx={{color:"#1976d2"}}>Workspace: {workspaceName}</Typography>

          <Button onClick={() => createPaperRoute()} sx={{width: "100%", textTransform: "none", justifyContent: "flex-start", textAlign:"left", padding: 0, ":hover": {backgroundColor: "lightGrey"}, marginBottom: "1em"}}>
            <Paper sx={{width: "100%", backgroundColor: "transparent", padding: "0.5em"}}>
              <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Basic Route</Typography>
              <Typography variant="body1">Click To Create Basic Route:</Typography>
              <ul style={{paddingTop: 0, marginTop: 0}}>
                <li><Typography variant="body2">Calculates Fastest Route</Typography></li>
                <li><Typography variant="body2">Delivery Prioritization</Typography></li>
                <li><Typography variant="body2">Printable</Typography></li>
              </ul>
            </Paper>
          </Button>
              
          <Button sx={{width: "100%", textTransform: "none", justifyContent: "flex-start", textAlign:"left", padding: 0, ":hover": {backgroundColor: "lightGrey"}, marginBottom: "1em"}}>
            <Paper sx={{width: "100%", backgroundColor: "transparent", padding: "0.5em"}}>
              <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Digital Route (Work In Progress)</Typography>
              <Typography variant="body1">Click To Create Digital Route:</Typography>
              <ul style={{paddingTop: 0, marginTop: 0}}>
                <li><Typography variant="body2">Calculates Fastest Route</Typography></li>
                <li><Typography variant="body2">Delivery Prioritization</Typography></li>
                <li><Typography variant="body2">Send to Driver's Mobile App</Typography></li>
                <li><Typography variant="body2">Driver Tracking</Typography></li>
                <li><Typography variant="body2">Automatic Customer Email Sending</Typography></li>
                <ul>
                  <li><Typography variant="body2">Dispatch email</Typography></li>
                  <li><Typography variant="body2">Estimated Day of Delivery</Typography></li>
                  <li><Typography variant="body2">Estimated Time Of Delivery</Typography></li>
                  <li><Typography variant="body2">Delay notifications</Typography></li>
                </ul>
                <li><Typography variant="body2">Digital Signoff</Typography></li>
                <li><Typography variant="body2">Track and Trace Email</Typography></li>
              </ul>
            </Paper>
          </Button>

        </RouteMenuStyle>
    )
}


