import { Box, Button, Paper, Stack, TextField } from "@mui/material"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { getServerUrl } from "../../services/server.service"
import { RSBearerToken, RSWorkspaceID } from "../../state/globalstate"
import StandardHeader from "../common/StandardHeader.component"

interface IMember{
    email: string;
    role: string;
    userName: string;
}

const AdminPanel: React.FC = () => {

    const [R_workspaceId, R_setWorkspaceId] = useRecoilState(RSWorkspaceID)
    const R_bearer = useRecoilValue(RSBearerToken)
    const [memberEmail, setMemberEmail] = useState("")
    const [members, setMembers] = useState<IMember[]>([])

    useEffect(() => {
        getAllMembers()
    }, [])

    function getAllMembers()
    {
      axios.post<IMember[]>(getServerUrl() + "/admin/members",
        {
            workspaceId: R_workspaceId,
        },
        {
          headers: {authorization: R_bearer}
        }).then(res => {
            console.log(res.data)
            setMembers(res.data)
            
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
                    <TextField id="email" label="Member Email" variant="standard"  value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}/>
                </Box>

                <Box>
                    <Button onClick={() => {addMember()}}>Add Member</Button>
                </Box>
            </Stack>

            <Stack>
                <Box>
                    <h4>Members</h4>
                </Box>
                <Box>
                    <Button onClick={() => {getAllMembers()}}>Refresh</Button>
                </Box>
                {members.length > 0 && ( 
                    members.map((member, idx) => {
                        return <Member key={`member-${idx}`} member={member}/>
                    })
                )}
            </Stack>
            
        </div>
    )
}

export default AdminPanel


interface IMemberProps{
    member: IMember
}

const Member: React.FC<IMemberProps> = ({member}) => {
    return(

        <Box sx={{margin: "1em"}}>
            <Paper>
                <Stack>
                    <Box>
                        {member.userName}   
                    </Box>
                    <Box>
                        {member.email}   
                    </Box>
                    <Box>
                        {member.role}   
                    </Box>


                    
                    
                    
                </Stack>
                
            </Paper>
            
        </Box>

    )
}