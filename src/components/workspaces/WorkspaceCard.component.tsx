import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { RSBearerToken, RSWorkspaceID } from "../../state/globalstate";
import { updateLastUsedWorkspaceId } from "./workspace.service";

type CardProps = {
    name: string;
    id: string;
}

export default function WorkSpaceCard({name, id}: CardProps)
{
    const [R_workspaceId, R_setWorkspaceId] = useRecoilState(RSWorkspaceID)
    const R_bearer = useRecoilValue(RSBearerToken)
    let navigate = useNavigate();

    function setSelectionAndNavigate()
    {
        R_setWorkspaceId(id);
        //TODO update lastUsedWorkspaceId of user in Db when they select a workspace here
        console.log("Bearer token is:", R_bearer)
        updateLastUsedWorkspaceId(R_bearer, R_workspaceId)
        navigate("/routeMenu", {replace: true})
    }
    
    return(
        <div style={{padding: "10px"}}>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {name}</Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Some description
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* C */}
                    <Button size="small" onClick={() => setSelectionAndNavigate()}>Open</Button>
                    <Button size="small">Admin</Button>
                </CardActions>
            </Card>
        </div>
    )
}

