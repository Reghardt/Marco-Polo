import { Box, Button, DialogActions, DialogContent, DialogTitle, Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material"
import { useState } from "react";
import TabPanel, { a11yProps } from "../../../Tabs/TabPanel.component";
import { createDriverTrip } from "../../../../Services/Trip.service";
import { InviteDriver } from "./InviteDriver.component";
import { useSendTripToDriver, useGetDriversQuery } from "../../../../trpc-hooks/trpcHooks";
import { IDriver } from "trpc-server/trpc/models/Driver.model";

interface IDriverDialogProps{
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DriverDialog: React.FC<IDriverDialogProps> = ({setIsModalOpen}) => {

    const [tabValue, setTabValue] = useState(0)
    const [tripName, setTripName] = useState("")
    const [error, setError] = useState("")
    const [assignedDriver, setAssignedDriver] = useState<IDriver | null>(null)
    const [sentStatus, setSentStatus] = useState("")

 
    const getDrivers = useGetDriversQuery()
    const sendToDriver = useSendTripToDriver({doOnSuccess: () => {
        if(assignedDriver)
        {
            setSentStatus(`Sent "${tripName}" to ${assignedDriver.firstName} ${assignedDriver.lastName}`)
        }

    }})


    function assignTripToDriver()
    {
        if(assignedDriver === null)
        {
            setError("No driver assigned")
        }
        else if(tripName === "")
        {
            setError("No trip name")
        }
        else
        {
            setError("")
            const driverTrip = createDriverTrip()
            if(driverTrip.errorMsg)
            {
                setError(driverTrip.errorMsg)
                return
            }

            sendToDriver.mutate({
                tripName: tripName,
                assignedDriverId: assignedDriver._id.toString(),
                legs: driverTrip.legs})
        }
    }

    return(
        <Box>
            <DialogTitle color={"primary"} variant="h5">Drivers</DialogTitle>
            <DialogContent>
                <Tabs value={tabValue} onChange={(_e, v) => {setTabValue(v)}} aria-label="basic tabs example">
                    <Tab label={"Drivers"} {...a11yProps(0)}/>
                    <Tab label={"Invite Driver"} {...a11yProps(1)}/>
                    <Tab label={"QR Code"} {...a11yProps(2)}/>
                </Tabs>

                <TabPanel value={tabValue} index={0}>

                        <Stack spacing={"1em"}>
                            <Box>
                                <TextField value={tripName} onChange={(e) => {setTripName(e.target.value)}} label={"Trip Name"}></TextField>
                            </Box>
                            <Box>
                                <Typography>Assigned driver: {assignedDriver !== null ? `${assignedDriver.firstName} ${assignedDriver.lastName}` : "none"}</Typography>
                            </Box>

                            {error ?
                            <Box>
                                
                                <Typography color={"error"}>{error}</Typography>
                            </Box>
                            :
                            <>
                            </>}
                            
                            
                            <Box>
                                <Button onClick={() => assignTripToDriver()}>Send Trip To Driver</Button>
                            </Box>

                            <Box sx={{color:"green"}}>
                                {sentStatus}
                            </Box>
                            <Box>
                                <Typography sx={{color:"#1976d2"}} variant="h6">Available Drivers:</Typography>
                            </Box>
                        </Stack>
                        
                        {getDrivers.data?.map((elem, index) => {
                            return(
                                <Box key={`driver-${index}`}>
                                    
                                    <Paper sx={{width: "100%"}} elevation={0} > 
                                        <Stack direction={"row"} alignItems="center">
                                            
                                            <Box sx={{width: "90%"}}>
                                                <Button onClick={() => setAssignedDriver(elem)} sx={{width: "100%", textTransform: "none", justifyContent: "flex-start", textAlign:"left", p: "0.2em", ":hover": {backgroundColor: "#8d8d8d11"}}}>
                                                    <Paper sx={{background: "transparent", width: "100%", height: "100%"}} elevation={0}>
                                                        <Stack>
                                                            <Typography variant="subtitle1" sx={{color:"#1976d2"}}>{elem.firstName} {elem.lastName}</Typography>
                                                            <Typography variant="body2">{elem.username}</Typography>
                                                        </Stack>
                                                    </Paper>
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Box>
                            )
                        })}

                    
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <InviteDriver/>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box>
                        
                        <img src="/mpt-qr.svg" alt="MP travels qr code"/>
                        <Typography sx={{mb:"1em"}}>https://marco-polo-travels.vercel.app</Typography>
                        <Typography variant="h6">Instructions</Typography>
                        <Typography>
                            Scan the above QR code or use the link on a Android phone to download Marco Polo Travels, the mobile companion app. 
                            <br/><br/>
                            Once the page has loaded wait a few seconds for the download prompt to appear. 
                            The app will be installed and appear as an icon that can be opened on your phone after a short period of time. 
                            <br/><br/>
                            Next, create a driver account by providing the neccesarry details in the app.
                            The provided username can be used to link MP Travels with the workspace in the "Invite Drivers" tab above, after which drivers can be assigned trips from the "Drivers" tab.
                        </Typography>
                    </Box>
                    
                </TabPanel>

                
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsModalOpen(current => !current)}>Close</Button>
            </DialogActions>
        </Box>
    )
}