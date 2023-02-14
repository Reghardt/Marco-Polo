import { Box, Button } from "@mui/material"

import { ETableMode, useTripStore } from "../../../../Zustand/tripStore"

//this component is displayed as a button.
//It is only showed when the table is in a solve mode
//when clicked it accepts all addresses as confirmed and sets the table in edit mode
const ConfirmAllAddresses: React.FC = () => {

    const Z_tabelMode = useTripStore(store => store.data.tabelMode)
    const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
    const Z_linkAddressColumnIndex = useTripStore(store => store.data.linkAddressColumnIndex)
    const Z_tripRows = useTripStore(store => store.data.rows)

    const ZF_updateBodyCell = useTripStore(store => store.actions.updateBodyCell)
    const ZF_setErrorMessage = useTripStore(store => store.actions.setErrorMessage)

    function confirmAll()
    {
      let columnIndexToConfirm = Z_addressColumnIndex

      if(Z_tabelMode === ETableMode.LinkAddressSolveMode)
      {
        columnIndexToConfirm = Z_linkAddressColumnIndex
      }

      if(columnIndexToConfirm > -1)
      {
        for(let i = 0; i < Z_tripRows.length; i++)
        {
          const row = Z_tripRows[i]
          if(row)
          {

            const cell = row.cells[columnIndexToConfirm]
            if(cell && cell.address.latLng && cell.address.isAddressAccepted === false)
            {
              ZF_updateBodyCell({...cell, address: {...cell.address, isAddressAccepted: true}})
            }
            else if(!cell || cell.address.latLng === null)
            {
              ZF_setErrorMessage("Error: An address has a problem")
            }
            
          }
        }
      }
      

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