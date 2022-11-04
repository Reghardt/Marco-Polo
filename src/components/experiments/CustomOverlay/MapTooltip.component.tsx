import { CloseOutlined } from "@mui/icons-material"
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { useRecoilState } from "recoil"
import { IRow } from "../../../services/worksheet/row.interface"

import { RSTripRows } from "../../../state/globalstate"
import { reorder } from "../../Trip/MasterSequence/MasterSequence.service"
//import { reorder } from "../../Trip/MasterSequence/MasterSequence.service"

interface IMapTooltipProps{
    handlePopperVisibility: () => void,
    markerRowNumber: number,
}

const MapTooltip : React.FC<IMapTooltipProps> = ({handlePopperVisibility, markerRowNumber}) => {

    const [R_tripRows, R_setTripRows ] = useRecoilState(RSTripRows)
    
    const [moveTo, setMoveTo] = useState("")

    function createData()
    {
        const row = R_tripRows[markerRowNumber]
        const stackElem = <React.Fragment>
            {row.cells.map((elem, idx) => {
                return <Box key={`tooltip-data-elem-${idx}`}>{elem.data}</Box>
            })}
        </React.Fragment>
        return stackElem
    }

    function handleReorder(tripRows: IRow[], startIndex: number, endIndex: number)
    {
        //reorder(R_tripRows)
        if(endIndex)
        {
            let offsetEndIndex = endIndex - 1
            if(offsetEndIndex > 0 && offsetEndIndex < tripRows.length)
            {
                console.log(tripRows, startIndex, offsetEndIndex - 1)
                const reorderedTripRows = reorder(tripRows, startIndex, offsetEndIndex)
                console.log(reorderedTripRows)
                R_setTripRows(reorderedTripRows)
            }
        } 
    }
    

    function satitizeAndSetMoveTo(input: string)
    {
        if(input === "")
        {
            setMoveTo("")
        }
        else
        {
            const parsedInput = parseInt(input)
            if(!isNaN(parsedInput))
            { 
                setMoveTo(parsedInput.toString())
            }
        }


    }

    return(
        <div>
            <Stack direction={"row"} justifyContent="end" sx={{marginBottom: "0.5em"}}>
                <Box>
                    <IconButton onClick={() => {handlePopperVisibility()}} sx={{height: "0.5em", width: "0.5em"}}>
                        <CloseOutlined color={"error"} fontSize="small"/>
                    </IconButton>
                </Box>
            </Stack>

            <Stack spacing={0.5}>
                {createData()}

                <Box>
                    <Stack direction={"row"} spacing={1} alignItems="center">
                        <Box>
                            <Typography >Move To:</Typography>
                        </Box>
                        <Box>
                            <TextField value={moveTo} onChange={(e) => satitizeAndSetMoveTo(e.target.value)} sx={{ width: "5em"}} size="small"/>
                        </Box>
                        <Box>
                            <Button onClick={() => {handleReorder(R_tripRows, markerRowNumber, parseInt(moveTo))}} variant="outlined" sx={{height: "100%"}}>OK</Button>
                        </Box>
                        
                    </Stack>
                    
                </Box>
            </Stack>
            

            

  
        </div>
    )
}

export default MapTooltip