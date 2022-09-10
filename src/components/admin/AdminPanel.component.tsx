import { Box, Button, Stack, TextField } from "@mui/material"
import axios from "axios"
import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { getServerUrl } from "../../services/server.service"
import { RSBearerToken, RSWorkspaceID } from "../../state/globalstate"
import StandardHeader from "../common/StandardHeader.component"

const AdminPanel: React.FC = () => {

    const [R_workspaceId, R_setWorkspaceId] = useRecoilState(RSWorkspaceID)
    const R_bearer = useRecoilValue(RSBearerToken)
    const [memberEmail, setMemberEmail] = useState("")

    function getAllMembers()
    {
      axios.post(getServerUrl() + "/admin/members",
        {
            workspaceId: R_workspaceId,
        },
        {
          headers: {authorization: R_bearer}
        }).then(res => {
            console.log(res.data)
            
        }).catch(err => {
            console.error(err)
        })

    }

    function addMember()
    {
      axios.post(getServerUrl() + "/admin/addMember",
        {
            workspaceId: R_workspaceId,
            memberEmail: memberEmail
        },
        {
          headers: {authorization: R_bearer}
        }).then(res => {
            console.log(res.data)
            
        }).catch(err => {
            console.error(err)
        })

    }

    return(
        <div>
            <StandardHeader title="Admin Panel"/>

            <Stack>
                <Box>
                    <Button onClick={() => {getAllMembers()}}>Get members</Button>
                </Box>
                <Box>
                    <TextField id="email" label="Member Email" variant="standard"  value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}/>
                </Box>

                <Box>
                    <Button onClick={() => {addMember()}}>Add Member</Button>
                </Box>
            </Stack>
            
        </div>
    )
}

export default AdminPanel