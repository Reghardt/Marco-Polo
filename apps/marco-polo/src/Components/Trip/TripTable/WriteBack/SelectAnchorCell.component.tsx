import { Button, CircularProgress } from "@mui/material"
import { useState } from "react"
import { loadSelection } from "../../Worksheet/worksheet.service"

interface ISelectAnchorCell{
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    writeBackFrom: (topmostY: number, xOffset: number) => Promise<void>
}

const SelectAnchorCell: React.FC<ISelectAnchorCell> = ({setIsDialogOpen, writeBackFrom}) => {

    const [topLeftCoords, setTopLeftCoords] = useState<{x: number, y: number} | null>(null)

    async function getTopLeftCell()
    {
        const selection = await loadSelection()
        const cell = selection[0]?.cells[0]
        if(cell?.x !== undefined && cell.y !== undefined)
        {
            setTopLeftCoords({x: cell.x, y: cell.y})
        }
    }

    if(!topLeftCoords)
    {
        getTopLeftCell()
    }

    return(
        <div className="p-4">
            <div>
                Writeback
            </div>
            <div>
                Please select a cell(s) to write back to
            </div>

            <div>
                Current top left cell: {topLeftCoords ? <span>{topLeftCoords.x} {topLeftCoords.y}</span> : <CircularProgress size={"18px"} />}
            </div>

            <div>
                <Button onClick={() => {
                    setTopLeftCoords(null)
                }}>Refresh</Button>
            </div>

            <div>
                <Button variant="contained" onClick={() => {
                    if(topLeftCoords)
                    {
                        setIsDialogOpen(false)
                        writeBackFrom(topLeftCoords.y, topLeftCoords.x - 1) // -1 for because excel is zero indexed 
                    }
                    
                }}>Confirm</Button>
            </div>
            
            
        </div>
    )
}

export default SelectAnchorCell