import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useAddDriverMutation } from "../../../../trpc-hooks/trpcHooks"
import { trpc } from "../../../../utils/trpc"
import { useAccountStore } from "../../../../Zustand/accountStore"

export const InviteDriver: React.FC = () => {
    const [driverUsername, setDriverUsername] = useState("")

    const utils = trpc.useContext()

    const addDriver = useAddDriverMutation({
        doOnSuccess: () => {
            utils.driver.getDrivers.invalidate()
        },
    })


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
                    <Button onClick={() => {addDriver.mutate({workspaceId: useAccountStore.getState().values.workspaceId, username: driverUsername})}}>Add Driver</Button>
                </Box>
            </Stack>
        </Box> 
    )
}