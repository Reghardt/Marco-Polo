import { DeleteOutline } from "@mui/icons-material"
import { Button, IconButton, Tab, Tabs, TextField, Tooltip } from "@mui/material"
import React, { useState } from "react"

import TabPanel, { a11yProps } from "../../Tabs/TabPanel.component"

import { useCreateAddressBookEntry, useDeleteAddressBookEntryMutation, useGetAddressBookQuery } from "../../../trpc-hooks/trpcHooks"
import { trpc } from "../../../utils/trpc"
import GAutoComplete from "../../Experiments/GAutoComplete.component"
import { IAddress } from "../../common/CommonInterfacesAndEnums"

interface IAddressBookDialogProps{
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    applyAddressBookSelection: (address: string) => void
}



export interface INewAddress{
    physicalAddress: string,
    addressDescription: string
  }





const AddressBookDialog: React.FC<IAddressBookDialogProps> = ({setIsModalOpen, applyAddressBookSelection}) => {
    //TODO read up on top, left and translate, and their interactions with each other
    const [tabValue, setTabValue] = useState(0)

    const [physicalAddress, setPhysicalAddress] = useState<IAddress | null>(null)

    const [addressDescription, setAddressDescription] = useState("")


    const [errorMessage, setErrorMessage] = useState("")

    const utils = trpc.useContext()

    const addressBookQuery = useGetAddressBookQuery()

    const createAddressBookEntry = useCreateAddressBookEntry({
        doOnSuccess: () => {
        setPhysicalAddress(null)
        setErrorMessage("")
        setAddressDescription("")
        setTabValue(0)

        utils.addressBook.getAddressBook.invalidate()

    }})

    function handleSetPhysicalAddress(address: IAddress | null)
    {
        if(address)
        {
            setPhysicalAddress(address)
        }
        
    }

    const deleteAddressBookEntry = useDeleteAddressBookEntryMutation({
        doOnSuccess: () => {
            utils.addressBook.getAddressBook.invalidate()
        },
    });

    function captureAddressDescription(input: string)
    {
        setAddressDescription(input)
    }


    function saveAddressToAddressBook()
    {
        if(physicalAddress)
        {
            if(addressDescription)
            {
                createAddressBookEntry.mutate({
                    physicalAddress: physicalAddress.formatted_address, 
                    addressDescription: addressDescription
                })
                setErrorMessage("")
            }
            else
            {
                setErrorMessage("Please provide an address description.")
            }
        }
        else
        {
            setErrorMessage("Please search for an address.")
        }
    }

    function handledeleteAddressBookEntry(entryId: string)
    {
        deleteAddressBookEntry.mutate({
            addressBookEntryId: entryId})
    }

    return(
        <React.Fragment>
            <div className={"bg-[#1976d2] w-full h-1"}></div>
            <div className="p-4 ">
                <Tabs value={tabValue} onChange={(_e, v) => {setTabValue(v)}} aria-label="basic tabs example">
                    <Tab label={"Saved Addresses"} {...a11yProps(0)}/>
                    <Tab label={"Create Address"} {...a11yProps(1)}/>
                </Tabs>

                <div className="mb-4 ">
                    <TabPanel value={tabValue} index={0}>
                        <div>
    
                            {addressBookQuery.data?.addressBookEntries && addressBookQuery.data.addressBookEntries.length > 0 && (
                                <div>
                                    <div className="flex flex-col gap-4" style={{gridTemplateColumns: "max-content min-content"}}>
                                        {addressBookQuery.data.addressBookEntries.map((entry, index) => {
                                        return(
                                            <>

                                                <div key={`addressBookEntry-${index}`}  style={{width: "300px", boxShadow: "",}}> 
                                                    <div className="grid items-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100" style={{gridTemplateColumns: "1fr min-content"}}>
                                                        <div>
                                                            <button onClick={() => {applyAddressBookSelection(entry.physicalAddress)}} className="text-left " style={{textTransform: "none"}}>
                                                                <div>
                                                                    <div className=" text-[#1976d2]">{entry.addressDescription}</div>
                                                                    <div>{entry.physicalAddress}</div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <Tooltip title={"Delete Entry"}>
                                                                <IconButton onClick={() => {handledeleteAddressBookEntry(entry._id.toString()); console.log("pressed")}}>
                                                                    <DeleteOutline color="error"/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>

                                            )}
                                        )}
                                    </div>
                                </div> 
                            )}

                            {addressBookQuery.data?.addressBookEntries && addressBookQuery.data.addressBookEntries.length === 0 && (
                                <div>
                                    <div>No saved addresses, to create one click on "Create New Address".</div>
                                </div>
                            )}
                        </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="text-sm ">Create New Address Book Entry:</div>
                            </div>

                            <div className="z-50 ">
                                <GAutoComplete setAddress={handleSetPhysicalAddress} currentAddress={physicalAddress ? physicalAddress.formatted_address : ""}/>
                            </div>

                            <div>
                                <TextField  value={addressDescription} onChange={(e)=> captureAddressDescription(e.target.value)} size="small" label="Descriptive Address Name" fullWidth></TextField>
                            </div>

                            <div>
                                <Button variant="contained" onClick={() => {saveAddressToAddressBook()}} >Save To Address Book</Button>
                            </div>

                            {errorMessage && (
                                <div>
                                    <p style={{color: "red"}}>{errorMessage}</p>
                                </div>
                            )}
                        </div>
                    </TabPanel>
                </div>

                
                
                <div className="flex justify-end">
                    <Button variant="text" color="error" onClick={() => {setIsModalOpen((current) => {return !current})}}>close</Button>
                </div>                         
            </div>
                
        </React.Fragment>
        
    )
}

export default AddressBookDialog