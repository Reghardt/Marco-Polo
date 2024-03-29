import { DeleteOutline } from "@mui/icons-material"
import { Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material"
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

    function handleSetPhysicalAddress(address: IAddress)
    {
        setPhysicalAddress(address)
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
        if(addressDescription && physicalAddress)
        {
            
            createAddressBookEntry.mutate({
                physicalAddress: physicalAddress.formatted_address, 
                addressDescription: addressDescription})
        }
        else
        {
            setErrorMessage("No address description provided")
        }
    }

    function handledeleteAddressBookEntry(entryId: string)
    {
        deleteAddressBookEntry.mutate({
            addressBookEntryId: entryId})
    }

    return(
        <React.Fragment>
            
                <DialogTitle color={"primary"} variant="h5">Address Book</DialogTitle>
                <DialogContent>

                <Tabs value={tabValue} onChange={(_e, v) => {setTabValue(v)}} aria-label="basic tabs example">
                    <Tab label={"Saved Addresses"} {...a11yProps(0)}/>
                    <Tab label={"Create Address"} {...a11yProps(1)}/>

                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Stack spacing={1}>
                        <Box>
                            <Typography color={"primary"} variant="h6">Saved Addresses:</Typography>
                        </Box>

                        {addressBookQuery.data?.addressBookEntries && addressBookQuery.data.addressBookEntries.length > 0 && (
                            <Box>
                                <Stack spacing={1}>
                                    {addressBookQuery.data.addressBookEntries.map((entry, index) => {
                                    return(
                                        <Box key={`addressBookEntry-${index}`}>
                                            
                                            <Paper sx={{width: "100%"}} elevation={0} > 
                                                <Stack direction={"row"} alignItems="center">
                                                    
                                                    <Box sx={{width: "90%"}}>
                                                        <Button onClick={() => {applyAddressBookSelection(entry.physicalAddress)}} sx={{width: "100%", textTransform: "none", justifyContent: "flex-start", textAlign:"left", p: "0.2em", ":hover": {backgroundColor: "#8d8d8d11"}}}>
                                                            <Paper sx={{background: "transparent", width: "100%", height: "100%"}} elevation={0}>
                                                                <Stack>
                                                                    <Typography variant="subtitle1" sx={{color:"#1976d2"}}>{entry.addressDescription}</Typography>
                                                                    <Typography variant="body2">{entry.physicalAddress}</Typography>
                                                                </Stack>
                                                            </Paper>
                                                        </Button>
                                                    </Box>
                                                    <Box sx={{justifyContent:"center", alignItems: "center", display: "flex", width: "10%"}}>
                                                        <Tooltip title={"Delete Entry"}>
                                                            <IconButton onClick={() => {handledeleteAddressBookEntry(entry._id.toString()); console.log("pressed")}}>
                                                                <DeleteOutline color="error"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        </Box>
                                        )}
                                    )}
                                </Stack>
                            </Box> 
                        )}

                        {addressBookQuery.data?.addressBookEntries && addressBookQuery.data.addressBookEntries.length === 0 && (
                            <Box>
                                <Typography variant="subtitle1">No saved addresses, click on "Create New Address"</Typography>
                            </Box>
                        )}
                    </Stack>
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                    {/* <Divider sx={{marginTop: "2em", marginBottom: "1em"}}></Divider> */}
                    <Stack spacing={1}>

                        <Box>
                            <Typography variant="h6">Create New Address Book Entry:</Typography>
                        </Box>

                        <div className="z-50 ">
                            <GAutoComplete setAddress={handleSetPhysicalAddress} currentAddress={physicalAddress ? physicalAddress.formatted_address : ""}/>
                        </div>


                        {physicalAddress && (
                            <React.Fragment>
                                <Box>
                                    <TextField value={addressDescription} onChange={(e)=> captureAddressDescription(e.target.value)} size="medium" label="Descriptive Address Name" fullWidth></TextField>
                                </Box>
                                <Box>
                                    <Button onClick={() => {saveAddressToAddressBook()}} >Save To Address Book</Button>
                                </Box>
                            </React.Fragment>
                            
                        )}

                        {errorMessage && (
                            <Box>
                                <p style={{color: "red"}}>{errorMessage}</p>
                            </Box>
                        )}
                    </Stack>
                </TabPanel>

 
                    
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={() => {setIsModalOpen((current) => {return !current})}}>Cancel</Button>
                </DialogActions>
        </React.Fragment>
        
    )
}

export default AddressBookDialog