import { Box, Button } from "@mui/material"
import { ETableMode, useTripStore } from "../../../../Zustand/tripStore"

//this component is displayed as a button.
//It is only showed when the table is in a solve mode
//when clicked it accepts all addresses as confirmed and sets the table in edit mode
const ConfirmAllAddresses: React.FC = () => {

    const Z_tabelMode = useTripStore(store => store.data.tabelMode)
    const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
    const Z_goToAddressColumnIndex = useTripStore(store => store.data.linkAddressColumnIndex)
    const Z_tripRows = useTripStore(store => store.data.rows)

    const ZF_updateBodyCell = useTripStore(store => store.reducers.updateBodyCell)
    const ZF_setErrorMessage = useTripStore(store => store.reducers.setErrorMessage)

    function confirmAll()
    {
      const colIndex = Z_tabelMode === ETableMode.AddressSolveMode ? Z_addressColumnIndex : Z_goToAddressColumnIndex
      for(let i = 0; i < Z_tripRows.length; i++)
      {
        const cell = Z_tripRows[i]!.cells[colIndex]
        if(cell?.geocodedDataAndStatus?.status === google.maps.GeocoderStatus.OK) // if OK then there is at least one result
        {
          ZF_updateBodyCell({...cell, isAddressAccepted: true})
        }
        else if(cell?.displayData === "")
        {
          continue
        }
        else
        {
          ZF_setErrorMessage("Error: An address has a problem")
          return;
        }
      }
      ZF_setErrorMessage("")
    }

    if(Z_tabelMode !== ETableMode.EditMode)
    {
      return(
        <Box sx={{display: "flex", justifyContent:"right"}}>
          <Button onClick={() => confirmAll()} variant="outlined">Confirm all</Button>
        </Box>
      )
    }
    return <></>
}

export default ConfirmAllAddresses