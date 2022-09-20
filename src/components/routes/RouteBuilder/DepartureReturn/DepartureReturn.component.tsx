import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { RSDepartReturnState, RSDepartureAddress, RSReturnAddress } from "../../../../state/globalstate"
import HelpTooltip from "../../../common/HelpTooltip.component"
import AddressSelector from "./AddressSelector.component"

export enum EDepartReturn{
    return,
    different
}

const DepartureReturn: React.FC = () => {

    const [R_departReturnState, R_setDepartReturnState] = useRecoilState(RSDepartReturnState)

    const [R_departureAddress, R_setDepartureAddress] = useRecoilState(RSDepartureAddress);
    const [R_returnAddress, R_setReturnAddress] = useRecoilState(RSReturnAddress);

    useEffect(() => {
        if(R_departReturnState === EDepartReturn.return)
        {
            R_setReturnAddress(R_departureAddress)
        }
    }, [R_departReturnState, R_departureAddress])
    

    return(
        <div style={{marginTop: "1em"}}>
            <Typography variant="h5" gutterBottom sx={{color:"#1976d2"}}>Trip Type</Typography>
            <Stack direction={"row"} alignItems="center" spacing={1} sx={{marginBottom: "1em"}}>
                <Box>
                    <ToggleButtonGroup
                        sx={{maxHeight:"100%", height: "100%"}}
                        size="small"
                        color="primary"
                        value={R_departReturnState}
                        exclusive
                        onChange={(_e, v) => {R_setDepartReturnState(v)}}
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

            

            {R_departReturnState === EDepartReturn.return && (
                <React.Fragment>
                    

                    <AddressSelector address={R_departureAddress} addressSetter={R_setDepartureAddress} title={"Depart & Return Address"}/>
                </React.Fragment>
            )}

            {R_departReturnState === EDepartReturn.different && (
                <React.Fragment>

                    <AddressSelector address={R_departureAddress} addressSetter={R_setDepartureAddress} title={"Depart Address"}/>
                    <AddressSelector address={R_returnAddress} addressSetter={R_setReturnAddress} title={"Return Address"}/>
                </React.Fragment>
            )}
            
            
        </div>
    )
}

export default DepartureReturn