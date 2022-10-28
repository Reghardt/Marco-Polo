import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { RSBearerToken } from '../../state/globalstate';
import HelpTooltip from '../common/HelpTooltip.component';
import StandardHeader, { EStandardHeaderConfig } from '../common/StandardHeader.component';
import WorkSpaceCard from './WorkspaceCard.component';

function getWorkspaces(bearer: string)
{
    console.log("bearer test fired")
    console.log(bearer)
    return axios.post("/api/workspace/myWorkspaces",
    {},
    {
        headers: {authorization: bearer}
    }).then((res) => {
        
        console.log("response received", res)
        return res.data;
    }).catch((err) => {
        console.error(err.response)
        return err;
    })
}

export default function WorkSpaces()
{
    const R_bearer = useRecoilValue(RSBearerToken)
    
    const [workspaces, setWorkspaces] = useState([])
    const [doesBelongToWorkspace, setDoesBelongToWorkspace] = useState(true)
    let navigate = useNavigate();



    useEffect(() => {
        console.log("fetch data")
        getWorkspaces(R_bearer)
        .then((res: any[]) => {
            console.log(res)
            setWorkspaces(res)
            if(res.length === 0)
            {
                setDoesBelongToWorkspace(false)
            }
        })
    }, [R_bearer])

    return(
        <div>
            <div>
                <StandardHeader 
                    title='Workspaces' 
                    tokenCountConfig={EStandardHeaderConfig.Hidden} 
                    tokenStoreConfig={EStandardHeaderConfig.Disabled}
                    adminPanelConfig={EStandardHeaderConfig.Disabled}
                />
                <Stack direction={"row"} alignItems="center" textTransform={"none"}>
                    <Box>
                        <Button onClick={() => navigate("/createWorkspace", {replace: true})} variant="outlined" sx={{m: "0.8em"}}>Create New Workspace</Button>
                    </Box>
                    <Box>
                        <HelpTooltip title='Trips are created within a workspace, multiple employees can join a workspace and create trips'/>
                    </Box>
                </Stack>

                <Paper sx={{m: "0.5em", p: "0.5em"}}>
                    <Typography variant="h6" gutterBottom sx={{ color:'#1976d2'}}>My Workspaces:</Typography>
                    <Box>
                        {workspaces.length > 0 && doesBelongToWorkspace && (
                            workspaces.map((elem, idx) => {
                                return <WorkSpaceCard name={elem.workspaceName} id={elem._id} key={idx}/>
                            })
                        )}
                    </Box>
                    <Box>
                        {doesBelongToWorkspace === false && (
                            <Typography variant="body1">You currently don't belong to a workspace, create one or ask an admin to invite you to an existing workspace.</Typography>
                        )}
                    </Box>

                </Paper>

                
            </div> 
        </div>
    )
    
}

