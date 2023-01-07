import { Box, Button, Stack, TextField } from "@mui/material";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createNewWorkspaceMutation, EQueryKeys } from "../../../Queries";


interface ICreateWorkspaceTab{
    setTabValue: React.Dispatch<React.SetStateAction<number>>
}

const useCreateNewWorkspaceMutation = (queryClient: QueryClient, onSuccessFunc: () => void) => useMutation({
    mutationFn: createNewWorkspaceMutation,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [EQueryKeys.myWorkspaces]});
        onSuccessFunc();
    }
})

export const CreateWorkspace: React.FC<ICreateWorkspaceTab> = ({setTabValue}) =>
{
    const queryClient = useQueryClient();
    
    const [workspaceName, setWorkspaceName] = useState("")
    const [descriptionPurpose, setDescriptionPurpose] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const workspaceMutation = useCreateNewWorkspaceMutation(queryClient, () => {
        setTabValue(0)
    })
    
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
                    <TextField sx={{width: "40em"}} size="small" id="descriptionPurpose" label="Short description or purpose" variant="outlined"  value={descriptionPurpose} onChange={(e) => setDescriptionPurpose(e.target.value)} />
                </Box>
                {errorMessage.length > 0 && (
                    <Box>
                        {errorMessage}
                    </Box>
                )}
                <Box>
                    <Button type="submit" onClick={() => {handleWorkspaceMutation()}}>Create</Button>
                </Box>
            </Stack>
            
        </Box>

    )
}