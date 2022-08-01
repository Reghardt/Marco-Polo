import { Button, FormControlLabel, FormGroup, Switch, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { getServerUrl } from "../../services/server.service";
import { RBearerToken, RWorkspaceID } from "../../state/globalstate";

const RouteCreator: React.FC = () => {

    let navigate = useNavigate();
    const [jobName, setJobName] = useState("")
    const workspaceId = useRecoilValue(RWorkspaceID)
    const [bearer, setBearer] = useRecoilState(RBearerToken)

    function createJob(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault(); // prevents whole page from refreshing
        axios.post(getServerUrl() + "/job/new",
        {
            jobName: jobName,
            collectionId: workspaceId
        },
        {
            headers: {authorization: bearer}
        }).then(res => {
            console.log(res.data)
            navigate("/jobEditor", {replace: true})
        }).catch(err => {
            console.error(err)
        })
    }

    return(
        <div>
            <Typography variant="h6" gutterBottom>Route Creator</Typography>
            {/* {workspaceId} */}
            

            <form onSubmit={(e) => createJob(e)}>
                <TextField id="jobName" label="Job Name" variant="filled"  value={jobName} onChange={(e) => setJobName(e.target.value)} />

                <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked />} label="Fastest Route" />
                    <FormControlLabel control={<Switch />} label="Personalised Email Sending" />
                </FormGroup>
                <Button type="submit">Create</Button>
            </form>
        </div>
    )
}

export default RouteCreator;