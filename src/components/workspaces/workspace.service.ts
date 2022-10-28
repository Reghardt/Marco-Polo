import axios from "axios"


export function updateLastUsedWorkspaceId(bearer: string, workspaceId: string)
{
    axios.post("/api/workspace/updateLastUsedWorkspaceId",
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
