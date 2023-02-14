import { Button, TextField } from "@mui/material"
import {  useState } from "react"
import { useInviteUserToWorkspace } from "../../trpc-hooks/trpcHooks"
import StandardHeader from "../common/StandardHeader.component"

const AdminPanel: React.FC = () => {

    const [inviteUserStatus, setInviteUserStatus] = useState<null | {invited: boolean, message: string}>(null)

    const inviteUserToWorkspace = useInviteUserToWorkspace({
        doOnSuccess(res) {
            console.log(res)
            if(res)
            {
                setInviteUserStatus(res)
                setTimeout(() => {
                    setInviteUserStatus(null)
                }, 5000)
            }
            
        },
    })

     

    const [userNameAndTag, setUserNameAndTag] = useState("")
    return(
        <div>
            <StandardHeader title="Admin Panel" backNavStr="/trip"/>

            <div className="p-2 space-y-4 ">
                <div>Invite User to workspace</div>

                <div className="flex items-center gap-2">
                    <div>
                        <TextField 
                        sx={{width: "280px"}}
                            size="small" 
                            label="Username with tag"
                            value={userNameAndTag}
                            onChange={(e) => setUserNameAndTag(e.target.value)}
                        />
                    </div>


                    <div>
                        <Button onClick={() => inviteUserToWorkspace.mutate({userNameAndTag: userNameAndTag})}>Invite</Button>
                    </div>

                    
                </div>

                {inviteUserStatus && (
                    <div>
                        {inviteUserStatus.message}
                    </div>
                )}


                
            </div>
            



        </div>
    )
}

export default AdminPanel