import { Button, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField} from "@mui/material"
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
    const [assignedDriver, setAssignedDriver ] = useState<IDriver | null>(null)
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
        <div>
            <div className={"bg-[#1976d2] w-full h-1"}></div>
            <div className="p-4">
                
                <div>
                    <Tabs value={tabValue} onChange={(_e, v) => {setTabValue(v)}} aria-label="basic tabs example">
                        <Tab label={"Send Trip"} {...a11yProps(0)}/>
                        <Tab label={"Invite Driver"} {...a11yProps(1)}/>
                        <Tab label={"QR Code"} {...a11yProps(2)}/>
                    </Tabs>

                    <TabPanel value={tabValue} index={0}>
                        <div className="flex flex-col gap-4 mt-4 ">

                            <div>
                                <TextField size="small" value={tripName} onChange={(e) => {setTripName(e.target.value)}} label={"Trip Name"}></TextField>
                            </div>

                            {error && (
                                <div>
                                    <div className="text-red-700 ">{error}</div>
                                </div>
                            )}
                                
                                
                            {sentStatus && (
                                <div>
                                    {sentStatus}
                                </div>
                            )}
                            



                            <div>
                                <FormControl variant="standard">
                                    <InputLabel  id="demo-simple-select-standard-label">Drivers</InputLabel>
                                    <Select
                                        sx={{minWidth: "400px", marginTop: "10px"}}
                                        onChange={(change) => {
                                            console.log(change.target.value)
                                            getDrivers.data?.forEach(driver => {
                                                if(driver._id.toString() === change.target.value)
                                                {
                                                    setAssignedDriver(driver)
                                                    return
                                                }
                                            })
                                        }}
                                        
                                        value={assignedDriver ? assignedDriver._id.toString() : ""}
                                    >

                                        {getDrivers.data?.map((elem, index) => {
                                            return(
                                                <MenuItem key={`driver-${index}`} value={elem._id.toString()}>{elem.firstName} {elem.lastName}</MenuItem>
                                            )
                                    })}
                                        
                                    </Select>
                                </FormControl>
                            </div>  

                            <div>
                                <Button variant="contained" onClick={() => assignTripToDriver()}>Send Trip To Driver</Button>
                            </div>
                        </div>
                        
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <InviteDriver/>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <div>
                            <div className="flex justify-center">
                                <img src="/mpt-qr.svg" alt="MP travels qr code"/>
                            </div>
                            
                            
                            <div className='flex flex-col items-center mx-8 text-sm' style={{marginBottom: "-10px"}}>
                                <div className='w-full h-2' ><hr/></div>
                                
                                <div style={{transform: "translate(0, -20px)"}}><div className={" bg-slate-200 rounded-full p-1 text-xs"}>OR</div> </div>
                            </div>
                            <div className="flex justify-center">
                                <div>https://marco-polo-travels.vercel.app</div>
                            </div>
                            
                            <div className=" text-[#1976d2] text-lg">Instructions</div>
                            <div>
                                Scan the above QR code or use the link to download Marco Polo Travels; the driver's mobile companion app. 
                                <br/><br/>
                                Once the page has loaded wait a few seconds for the download prompt to appear. 
                                The app will be installed and act like any other app.
                                <br/><br/>
                                The driver can create an account by providing the necessary details on the app. 
                                After creating an account, the driver's username and tag will appear, which can be used in the 'Invite Driver' tab to enable trip sending.
                            </div>
                        </div>
                        
                    </TabPanel>

                    
                </div>
                <div className="flex justify-end">
                    <div>
                        <Button color="error" onClick={() => setIsModalOpen(current => !current)}>Close</Button>
                    </div>
                    
                </div>
            </div>
            
        </div>
    )
}