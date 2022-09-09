import axios from "axios"
import { getServerUrl } from "../../services/server.service"
import { ICell } from "../../services/worksheet/cell.interface"
import { IRow } from "../../services/worksheet/row.interface"

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

export function createBasicHeadingCell(name: string, x: number)
{
    let cell: ICell = {x: x, y: -1, data: name, origionalData: name, geocodedAddressRes: null, geocodedResults: null, selectedGeocodedAddressIndex: null}
    return cell
}

export function createBasicHeadingRow(leng: number)
{
    let tempHeadings: IRow = {cells: []}
    for(let i = 0; i < leng; i++)
    {
        tempHeadings.cells.push(createBasicHeadingCell("C" + i, i))
    }

    return tempHeadings;
}