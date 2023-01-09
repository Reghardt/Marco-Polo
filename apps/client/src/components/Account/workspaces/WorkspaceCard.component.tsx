import { DeleteOutline } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccountStore } from "../../../Zustand/accountStore";
import { IWorkspace } from "../../common/CommonInterfacesAndEnums";

import { updateLastUsedWorkspaceId } from "../../../Services/workspace.service";


export const WorkSpaceCard: React.FC<IWorkspace> = ({_id, workspaceName, descriptionPurpose, tokens}) =>
{
    const ZF_setWorkspaceId = useAccountStore(state => state.actions.setWorkspaceId)
    const Z_bearer = useAccountStore(state => state.values.bearer)
    const navigate = useNavigate();

    async function setSelectionAndNavigate()
    {
        ZF_setWorkspaceId(_id);
        console.log("Bearer token is:", Z_bearer)
        updateLastUsedWorkspaceId(Z_bearer, _id)
        navigate("/trip", {replace: true})
    }
    
    return(
        <>
            <Paper sx={{width: "100%"}} elevation={0} > 
                <Stack direction={"row"} alignItems="center">
                    
                    <Box sx={{width: "90%"}}>
                        <Button onClick={() => {setSelectionAndNavigate()}} sx={{width: "100%", textTransform: "none", justifyContent: "flex-start", textAlign:"left", p: "0.2em", ":hover": {backgroundColor: "#8d8d8d11"}}}>
                            <Paper sx={{background: "transparent", width: "100%", height: "100%"}} elevation={0}>
                                <Stack>
                                    <Typography variant="subtitle1" sx={{color:"#1976d2"}}>{workspaceName}</Typography>
                                    <Typography variant="body2">{descriptionPurpose}</Typography>
                                    <Typography variant="body2">{tokens}</Typography>
                                </Stack>
                            </Paper>
                        </Button>
                    </Box>
                    <Box sx={{justifyContent:"center", alignItems: "center", display: "flex", width: "10%"}}>
                        <Tooltip title={"Delete Workspace"}>
                            <IconButton>
                                <DeleteOutline color="error"/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Stack>
            </Paper>
        </>
    )
}

