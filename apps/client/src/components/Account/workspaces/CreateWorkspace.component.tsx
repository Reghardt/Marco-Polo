import { Box, Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { useCreateNewWorkspaceMutation } from "../../../trpc-hooks/trpcHooks";
import { trpc } from "../../../utils/trpc";


interface ICreateWorkspaceTab{
    setTabValue: React.Dispatch<React.SetStateAction<number>>
}



export const CreateWorkspace: React.FC<ICreateWorkspaceTab> = ({setTabValue}) =>
{   
    const [workspaceName, setWorkspaceName] = useState("")
    const [descriptionPurpose, setDescriptionPurpose] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const utils = trpc.useContext()

    const workspaceMutation = useCreateNewWorkspaceMutation( {doOnSuccess: () => {
        setTabValue(0)
        utils.workspaces.getWorkspaces.invalidate()
    }})
    
    // const createNewWorkspace = () =>{
    //     console.log("bearer test fired")
    //     console.log(Z_bearer)
    //     if(companyName.length === 0)
    //     {
    //         setErrorMessage("Please provide a name for the workspace")
    //         return;
    //     }
    //     axios.post("/api/workspace/new",
    //     {
    //         companyName: companyName
    //     },
    //     {
    //         headers: {authorization: Z_bearer}
    //     }).then((res) => {
    //         console.log("Workspace Created:", res.data)
    //         setTabValue(0)
    //     }).catch((err) => {
    //         console.error(err.response)
    //     })
    // }

    function handleWorkspaceMutation()
    {
        if(workspaceName.length > 0)
        {
            workspaceMutation.mutate({workspaceName: workspaceName, descriptionPurpose: descriptionPurpose})
        }
        else
        {
            setErrorMessage("Please provide a name for the workspace")
        }
    }

    return(

        <Box sx={{m: "0.5em", p: "0.5em"}}> 
            <Stack spacing={1}>
                <Box>
                    <TextField size="small" id="companyName" label="Workspace Name" variant="outlined"  value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                </Box>

                <Box>
                    <TextField sx={{width: "90%"}} size="small" id="descriptionPurpose" label="Short description or purpose" variant="outlined"  value={descriptionPurpose} onChange={(e) => setDescriptionPurpose(e.target.value)} />
                </Box>
                {errorMessage.length > 0 && (
                    <Box>
                        {errorMessage}
                    </Box>
                )}
                <Box>
                    <Button variant="contained" type="submit" onClick={() => {handleWorkspaceMutation()}}>Create</Button>
                </Box>
            </Stack>
            
        </Box>

    )
}