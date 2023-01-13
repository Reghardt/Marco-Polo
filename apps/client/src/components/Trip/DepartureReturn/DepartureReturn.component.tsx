import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import React from "react"
import { useGetAddressBookQuery } from "../../../trpc-hooks/trpcHooks"

import { EDepartReturn, useTripStore } from "../../../Zustand/tripStore"
import HelpTooltip from "../../common/HelpTooltip.component"

import AddressSelector from "./AddressSelector.component"



const DepartureReturn: React.FC = () => {

    const Z_returnAddress = useTripStore(store => store.data.returnAddress)
    const Z_setReturnAddress = useTripStore(store => store.reducers.setReturnAddress)

    const Z_departureAddress = useTripStore(store => store.data.departureAddress)
    const Z_setDepartureAddress = useTripStore(store => store.reducers.setDepartureAddress)

    const Z_departReturnState = useTripStore(store => store.data.departureReturnState)
    const Z_setDepartReturnState = useTripStore(store => store.reducers.setDepartureReturnState)

    useGetAddressBookQuery()
    
    return(
        <Box>
            <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Trip Type</Typography>
            <Stack direction={"row"} alignItems="center" spacing={1} sx={{marginBottom: "1em"}}>
                <Box>
                    <ToggleButtonGroup
                        sx={{maxHeight:"100%", height: "100%"}}
                        size="small"
                        color="primary"
                        value={Z_departReturnState}
                        exclusive
                        onChange={(_e, v) => {
                            if(v !== null)
                            {
                                Z_setDepartReturnState(v)
                            }
                            
                        }}
                        aria-label="Address Type"
                        >
                        <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EDepartReturn.return}>Return Trip</ToggleButton>
                        <ToggleButton sx={{textTransform: "none", maxHeight:"inherit"}} value={EDepartReturn.different}>Non Return Trip</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box>
                    <HelpTooltip title="With Return Trip the vehicle departs from and returns to the same address. With Non Return Trip, the depart and return addresses may be specified individually"/>
                </Box>
            </Stack>

            {Z_departReturnState === EDepartReturn.return && (
                <React.Fragment>
                    

                    <AddressSelector address={Z_departureAddress} addressSetter={Z_setDepartureAddress} title={"Departure & Return Address"}/>
                </React.Fragment>
            )}

            {Z_departReturnState === EDepartReturn.different && (
                <React.Fragment>

                    <AddressSelector address={Z_departureAddress} addressSetter={Z_setDepartureAddress} title={"Departure Address"}/>
                    <AddressSelector address={Z_returnAddress} addressSetter={Z_setReturnAddress} title={"Return Address"}/>
                </React.Fragment>
            )}
            
            
        </Box>
    )
}

export default DepartureReturn