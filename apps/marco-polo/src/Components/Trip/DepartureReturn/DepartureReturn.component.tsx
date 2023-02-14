import { FormControlLabel, Switch } from "@mui/material"
import React from "react"
import { useGetAddressBookQuery } from "../../../trpc-hooks/trpcHooks"

import { EDepartReturn, useTripStore } from "../../../Zustand/tripStore"
import HelpTooltip from "../../common/HelpTooltip.component"

import AddressSelector from "./AddressSelector.component"



const DepartureReturn: React.FC = () => {

    const Z_returnAddress = useTripStore(store => store.data.returnAddress)
    const Z_setReturnAddress = useTripStore(store => store.actions.setReturnAddress)

    const Z_departureAddress = useTripStore(store => store.data.departureAddress)
    const Z_setDepartureAddress = useTripStore(store => store.actions.setDepartureAddress)

    const Z_departReturnState = useTripStore(store => store.data.departureReturnState)
    const Z_setDepartReturnState = useTripStore(store => store.actions.setDepartureReturnState)

    useGetAddressBookQuery()
    
    return(
        <div>
            <div className={"flex items-center"}>
                <div>
                    <FormControlLabel control={
                        <Switch
                            checked={Z_departReturnState === EDepartReturn.return ? true : false}
                            onChange={(_e, v) => {
                                if(v !== null)
                                {
                                    Z_setDepartReturnState(v ? EDepartReturn.return : EDepartReturn.different)
                                }
                                
                            }}
                            />} 
                        label="Circuit" />
                </div>
                <div>
                    <HelpTooltip title="If circuit is enabled, the Depart address is used as the return address"/>
                </div>
            </div>

            {Z_departReturnState === EDepartReturn.return && (
                    <AddressSelector address={Z_departureAddress} addressSetter={Z_setDepartureAddress} title={"Departure Address"}/>
            )}

            {Z_departReturnState === EDepartReturn.different && (
                <div>
                    <AddressSelector address={Z_departureAddress} addressSetter={Z_setDepartureAddress} title={"Departure Address"}/>
                    <AddressSelector address={Z_returnAddress} addressSetter={Z_setReturnAddress} title={"Return Address"}/>
                </div>
                    
            )}
            
            
        </div>
    )
}

export default DepartureReturn