import axios from "axios"
import { getServerUrl } from "../../services/server.service"

export function updateLastUsedWorkspaceId(bearer: string, workspaceId: string)
{
    axios.post(getServerUrl() + "/workspace/updateLastUsedWorkspaceId",
        {
            workspaceId: workspaceId
        },
        {
            headers: {authorization: bearer}
        }).then((res) => {
            console.log("Workspace id updated!:", res.data)
        }).catch((err) => {
            console.error(err.response)
        })
}