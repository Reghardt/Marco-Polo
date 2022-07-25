import { Button, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { workspaceID } from "../../state/globalstate";

export default function RouteCreator()
{
    const [jobName, setJobName] = useState("")
    const workspaceIdString = useRecoilValue(workspaceID)
    let navigate = useNavigate();

    function createJob(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault(); // prevents whole page from refreshing
        navigate("/jobEditor", {replace: true})
    }

    return(
        <div>
            <h1>Route Creator</h1>
            {workspaceIdString}
            
            <form onSubmit={(e) => createJob(e)}>
                <TextField id="jobName" label="Job Name" variant="filled"  value={jobName} onChange={(e) => setJobName(e.target.value)} />
                <p> Select features:</p>
                <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked />} label="Fastest Route" />
                    <FormControlLabel control={<Switch />} label="Personalised Email Sending" />
                </FormGroup>
                <Button type="submit">Create</Button>
            </form>
        </div>
    )
}


