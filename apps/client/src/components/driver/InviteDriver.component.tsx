import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import { useAccountStore } from "../../../../Zustand/accountStore"

export const InviteDriver: React.FC = () => {
    const [driverUsername, setDriverUsername] = useState("")

    const Z_workspaceId = useAccountStore.getState().values.workspaceId
    const Z_bearer = useAccountStore.getState().values.bearer

    function addDriverWithUsername()
    {
        return axios.post("/api/workspace/addDriver", {
            username: driverUsername,
            workspaceId: Z_workspaceId,
        },
        {
            headers: {authorization: Z_bearer} //for user id
        })
    }

    async function handleAddDriver()
    {
        const res = await addDriverWithUsername()
        console.log(res)
    }

    return(
        <Box sx={{p: 0.5}}>
            <Stack spacing={"0.5em"}>
                <Box>
                    <Typography>Add Driver by Username</Typography>
                </Box>
                <Box>
                    <Stack direction={"row"} spacing={"0.5em"}>
                        <Box>
                            <TextField size="small" value={driverUsername} onChange={(e) => {setDriverUsername(e.target.value)}} label="Driver Username"/>
                        </Box>
                    </Stack>
                </Box>
                <Box>
                    <Button onClick={() => {handleAddDriver()}}>Add Driver</Button>
                </Box>
            </Stack>
        </Box> 
    )
}