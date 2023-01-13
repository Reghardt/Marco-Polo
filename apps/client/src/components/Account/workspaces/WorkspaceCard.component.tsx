import { DeleteOutline } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetLastUsedWorkspace } from "../../../trpc-hooks/trpcHooks";
import { useAuthStore } from "../../../Zustand/authStore";
import { IWorkspace } from "../../common/CommonInterfacesAndEnums";




export const WorkSpaceCard: React.FC<IWorkspace> = ({_id, workspaceName, descriptionPurpose, tokens}) =>
{
    const navigate = useNavigate();
    const ZF_setToken = useAuthStore(store => store.actions.setToken)

    const setLastUsedWorkspace = useSetLastUsedWorkspace({
        doOnSuccess: (res) => {
            ZF_setToken(res)
        }
    })

    async function setSelectionAndNavigate()
    {
        setLastUsedWorkspace.mutate({workspaceId: _id})
        navigate("/trip", {replace: true})
    }
    
    return(
        <>
            <div style={{width: "300px", boxShadow: "",}}> 
                <Stack direction={"row"} alignItems="center">
                    
                    <Box sx={{width: "90%"}}>
                        <Button onClick={() => {setSelectionAndNavigate()}} sx={{width: "100%", textTransform: "none", justifyContent: "flex-start", textAlign:"left", p: "0.2em", ":hover": {backgroundColor: "#8d8d8d11"}}}>
                            <Paper sx={{background: "transparent", width: "100%", height: "100%"}} elevation={0}>
                                <Stack>
                                    <Typography variant="subtitle1" sx={{color:"#1976d2"}}>{workspaceName}</Typography>
                                    {/* <hr style={{borderTop: "1px solid #a5a5a5", width: "110px", padding: "0", margin: "0"}}/> */}
                                    <Typography variant="body2">{descriptionPurpose}</Typography>
                                    <Typography variant="body2">{tokens}</Typography>
                                </Stack>
                            </Paper>
                        </Button>
                    </Box>
                    <Box sx={{justifyContent:"center", alignItems: "center", display: "flex", width: "10%", marginX: "5px"}}>
                        <Tooltip title={"Delete Workspace"}>
                            <IconButton>
                                <DeleteOutline color="error"/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Stack>
            </div>
        </>
    )
}

