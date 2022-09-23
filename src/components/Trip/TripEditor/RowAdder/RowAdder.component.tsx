import { Button, ClickAwayListener } from "@mui/material"
import React from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { ICell } from "../../../../services/worksheet/cell.interface"
import { IRow } from "../../../../services/worksheet/row.interface"
import { RSAddresColumIndex, RSJobBody } from "../../../../state/globalstate"
import { makeRowParentChildRelations, removeRowParentChildRelations } from "../../Trip.service"

const RowAdder: React.FC =() => {

    const [R_jobBody, R_setJobBody] = useRecoilState(RSJobBody)
    const R_addresColumIndex = useRecoilValue(RSAddresColumIndex)

    function addRowToBody(addressColumn: number)
    {
        console.log(R_jobBody)
        let newJobBody = removeRowParentChildRelations(JSON.parse(JSON.stringify(R_jobBody)) as IRow[])
        let highestRow = newJobBody[0].cells[0].y
        for(let i = 0; i < newJobBody.length; i++)
        {
            let row = newJobBody[i]
            if(row.cells[0].y > highestRow)
            {
                highestRow = row.cells[0].y
            }
        }

        let newRow: IRow = {cells: [], children: []}
        for(let i = 0; i < newJobBody[0].cells.length; i++)
        {
            if(addressColumn === i)
            {
                //TODO create a cell creator function so there is one truth
                let newCell: ICell ={x: i, y: highestRow + 1, data: "Address Placeholder", origionalData: "Address Placeholder", geocodedAddressRes: null, geocodedResults: [], selectedGeocodedAddressIndex: -1}
                newRow.cells.push(newCell)
            }
            else
            {
                let newCell: ICell ={x: i, y: highestRow + 1, data: "", origionalData: "", geocodedAddressRes: null, geocodedResults: [], selectedGeocodedAddressIndex: -1}
                newRow.cells.push(newCell)
            }
        }
        console.log(newRow)
        newJobBody.push(newRow)
        newJobBody = makeRowParentChildRelations(newJobBody, addressColumn)
        R_setJobBody(newJobBody)
    }
    
    return(
        <React.Fragment>
            <Button sx={{marginTop: "1em"}} variant="outlined" onClick={() => {addRowToBody(R_addresColumIndex)}}>Add Row</Button>
        </React.Fragment>
    )
}

export default RowAdder