import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { workspaceID } from "../../state/globalstate";

type CardProps = {
    name: string;
    id: string;
}

export default function WorkSpaceCard({name, id}: CardProps)
{
    const [workspaceIdString, setWorkspaceIdString] = useRecoilState(workspaceID)
    let navigate = useNavigate();

    function setSelectionAndNavigate()
    {
        setWorkspaceIdString(id);
        navigate("/jobCreator", {replace: true})
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

