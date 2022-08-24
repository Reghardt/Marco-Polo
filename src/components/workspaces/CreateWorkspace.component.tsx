import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getServerUrl } from "../../services/server.service";
import { RSBearerToken} from "../../state/globalstate";
import Payment from "../payment/Payment";


export default function CreateWorkspace()
{
    const [companyName, setCompanyName] = useState("")
    

    const [bearer, setBearer] = useRecoilState(RSBearerToken)
    let navigate = useNavigate();
    
    const createNewWorkspace = (e: React.FormEvent) =>{
        e.preventDefault(); // prevents whole page from refreshing
        console.log("bearer test fired")
        console.log(bearer)
        axios.post(getServerUrl() + "/workspace/new",
        {
            companyName: companyName
        },
        {
            headers: {authorization: bearer}
        }).then((res) => {
            console.log("Workspace Created:", res.data)
            //setWorkspaceIdString(res.data)
            navigate("/workspaces", {replace: true})
        }).catch((err) => {
            console.error(err.response)
        })
    }

    return(
        <div>
            <h1>Create Company Workspace</h1>
            
            <form onSubmit={(e) => createNewWorkspace(e)}>
                <TextField id="companyName" label="Workspace Name" variant="outlined"  value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                <br/>

                <Button type="submit">Create</Button>
            </form>

            <Payment/>
            
            <br/>
            
        </div>
    )
}