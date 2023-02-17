import { Button, TextField } from "@mui/material"
import { useState } from "react"
import { useAddDriverMutation } from "../../../../trpc-hooks/trpcHooks"
import { trpc } from "../../../../utils/trpc"
import HelpTooltip from "../../../common/HelpTooltip.component"

export const InviteDriver: React.FC = () => {
    const [driverUsername, setDriverUsername] = useState("")

    const utils = trpc.useContext()

    const addDriver = useAddDriverMutation({
        doOnSuccess: () => {
            utils.driver.getDrivers.invalidate()
        },
    })


    return(
        <div className="flex flex-col gap-4 mt-4">

            <div >
                <div className="text-sm ">Invite Driver by Username</div>
                
                
            </div>
            <div className="flex items-center gap-2">
                <div>
                    <TextField placeholder="UserName#1234" size="small" value={driverUsername} onChange={(e) => {setDriverUsername(e.target.value)}}/>
                </div>
                <div>
                    <HelpTooltip title={"Ask the driver for their username and tag, it shows in their mobile app once they have logged in."}/>
                </div>

            </div>
            <div>
                <Button variant="contained" onClick={() => {addDriver.mutate({username: driverUsername})}}>Invite Driver</Button>
            </div>

        </div> 
    )
}