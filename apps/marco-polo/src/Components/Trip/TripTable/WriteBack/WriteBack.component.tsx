import { Button, Dialog } from "@mui/material"
import { useState } from "react"
import { useTripStore } from "../../../../Zustand/tripStore"
import { IRow } from "../../../common/CommonInterfacesAndEnums"
import SelectAnchorCell from "./SelectAnchorCell.component"
import { getTopMostYCoordinate, writeBackToSpreadsheet } from "./WriteBack.service"

type IWriteBack = {
    tripRows: IRow[],
    addressColumnIndex: number
}

const WriteBack: React.FC<IWriteBack> = ({tripRows, addressColumnIndex}) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const ZF_setTripRows = useTripStore(store => store.actions.setTripRows)
    const ZF_setErrorMessage = useTripStore(store => store.actions.setErrorMessage)

    async function writeBackFrom(topmostY: number, xOffset: number)
    {
        const newRows = await writeBackToSpreadsheet(tripRows, addressColumnIndex, topmostY, xOffset)
        console.log(newRows)
        ZF_setTripRows(newRows)
        ZF_setErrorMessage("")
    }

    async function handleWriteBackToSpreadsheet()
    {
       const topmostY = getTopMostYCoordinate(tripRows)
      if(topmostY !== undefined && topmostY > -1)
      {
        writeBackFrom(topmostY, 0)
      }
      else
      {
        ZF_setErrorMessage("TEMP ERR: custom addresses only")
        setIsDialogOpen(true)
      }
    }

    return(
        <>
            <Button variant='text' onClick={() => {handleWriteBackToSpreadsheet()}}>Write back</Button>
            <Dialog
               PaperProps={{sx: {width: "80%", minHeight: "90%"}}}
                open={isDialogOpen}
                scroll={"body"}
                //onClose={}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <SelectAnchorCell setIsDialogOpen={setIsDialogOpen} writeBackFrom={writeBackFrom}/>
            </Dialog>
        </>
    )
}

export default WriteBack