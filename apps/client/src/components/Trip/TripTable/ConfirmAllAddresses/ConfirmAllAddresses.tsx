import { Box, Button } from "@mui/material"

import { ETableMode, useTripStore } from "../../../../Zustand/tripStore"

//this component is displayed as a button.
//It is only showed when the table is in a solve mode
//when clicked it accepts all addresses as confirmed and sets the table in edit mode
const ConfirmAllAddresses: React.FC = () => {

    const Z_tabelMode = useTripStore(store => store.data.tabelMode)
    // const Z_addressColumnIndex = useTripStore(store => store.data.addressColumnIndex)
    // const Z_linkAddressColumnIndex = useTripStore(store => store.data.linkAddressColumnIndex)
    // const Z_tripRows = useTripStore(store => store.data.rows)

    // const ZF_updateBodyCell = useTripStore(store => store.actions.updateBodyCell)
    // const ZF_setErrorMessage = useTripStore(store => store.actions.setErrorMessage)

    function confirmAll()
    {
      // let colToCheck = Z_addressColumnIndex
      // if(Z_tabelMode === ETableMode.LinkAddressSolveMode)
      // {
      //   colToCheck = Z_linkAddressColumnIndex
      // }
      

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