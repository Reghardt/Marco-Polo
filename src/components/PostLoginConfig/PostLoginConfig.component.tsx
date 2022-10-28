import axios from "axios"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil"
import { RSBearerToken, RSWorkspaceID } from "../../state/globalstate"



const PostLoginConfig: React.FC = () => {

    const R_workspaceId = useRecoilValue(RSWorkspaceID)
    const R_bearer = useRecoilValue(RSBearerToken)

    const navigate = useNavigate();

    console.log(R_workspaceId)

    function checkIfWorkspaceExists()
    {
        axios.post<{workspaceNameAndId: {_id: string, name: string}}>( "/api/workspace/doesWorkspaceExist", {
            workspaceId: R_workspaceId,
          },
          {
            headers: {authorization: R_bearer} //for user id
          }).then(res => {

            if(res.data.workspaceNameAndId === null)
            {
                navigate("/workspaces", {replace: true})
            }
            else
            {
                console.log(res.data.workspaceNameAndId)
                navigate("/jobEditor", {replace: true})
            }

            
    
          }).catch(err => {
            console.error(err)
    
          }
        )
    }

    useEffect(() => {
        checkIfWorkspaceExists()
    },[])

    return(
        <div>
            Loading...
        </div>
    )
}

export default PostLoginConfig