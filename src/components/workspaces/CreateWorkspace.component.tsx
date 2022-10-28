import { Box, Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { RSBearerToken} from "../../state/globalstate";
import StandardHeader, { EStandardHeaderConfig } from "../common/StandardHeader.component";
import Payment from "../payment/Payment";


export default function CreateWorkspace()
{
    const [companyName, setCompanyName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    

    const [bearer, setBearer] = useRecoilState(RSBearerToken)
    let navigate = useNavigate();
    
    const createNewWorkspace = () =>{
        console.log("bearer test fired")
        console.log(bearer)
        if(companyName.length === 0)
        {
            setErrorMessage("Please provide a name for the workspace")
            return;
        }
        axios.post("/api/workspace/new",
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
            {/* <h1>Create Company Workspace</h1> */}
            <StandardHeader 
                    title='Create Workspace' 
                    backNavStr="/workspaces"
                    tokenCountConfig={EStandardHeaderConfig.Hidden} 
                    tokenStoreConfig={EStandardHeaderConfig.Disabled}
                    adminPanelConfig={EStandardHeaderConfig.Disabled}
                />

                <Box sx={{m: "0.5em", p: "0.5em"}}> 
                    <Stack spacing={1}>
                        <Box>
                            <TextField id="companyName" label="Workspace Name" variant="outlined"  value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        </Box>
                        {errorMessage.length > 0 && (
                            <Box>
                                {errorMessage}
                            </Box>
                        )}
                        <Box>
                            <Button type="submit" onClick={() => {createNewWorkspace()}}>Create</Button>
                        </Box>
                    </Stack>
                    
                </Box>

            {/* <Payment/> */}
            

            
        </div>
    )
}