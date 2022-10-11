import { Help, HelpOutline } from '@mui/icons-material';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RSBearerToken } from '../../state/globalstate';
import HelpTooltip from '../common/HelpTooltip.component';
import StandardHeader, { EStandardHeaderConfig } from '../common/StandardHeader.component';
import WorkSpaceCard from './WorkspaceCard.component';

export default function WorkSpaces()
{
    const R_bearer = useRecoilValue(RSBearerToken)
    
    const [workspaces, setWorkspaces] = useState([])
    let navigate = useNavigate();



    
    const getWorkspaces = () =>{
        console.log("bearer test fired")
        console.log(R_bearer)
        return axios.post("/api/workspace/myWorkspaces",
        {},
        {
            headers: {authorization: R_bearer}
        }).then((res) => {
            
            console.log("response received", res)
            return res.data;
        }).catch((err) => {
            console.error(err.response)
            return err;
        })
    }

    useEffect(() => {
        console.log("fetch data")
        getWorkspaces()
        .then((res: any[]) => {
            console.log(res)
            setWorkspaces(res)
        })
    }, [])

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
                        <HelpTooltip title='Routes are created within a workspace, multiple employees can join a workspace and create routes'/>
                    </Box>
                </Stack>

                
                
                {/* <button onClick={() => bearerTest()}>Press me</button>
                {bearer} */}
                
                <div>
                    {workspaces.length > 0 && (
                        workspaces.map((elem, idx) => {
                            return <WorkSpaceCard name={elem.workspaceName} id={elem._id} key={idx}/>
                        })
                    )}

   

                </div>
            </div> 
        </div>
    )
    
}

