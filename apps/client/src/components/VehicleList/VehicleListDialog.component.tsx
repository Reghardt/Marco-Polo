import { DeleteOutline } from "@mui/icons-material";
import { Button, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react"
import { IVehicleListEntry } from "trpc-server/trpc/models/Workspace";
import { useCreateVehicleMutation, useGetVehicleListQuery, useDeletetVehicleMutation, useSetLastUsedVehicleMutation } from "../../trpc-hooks/trpcHooks";
import { trpc } from "../../utils/trpc";
import { useTripStore } from "../../Zustand/tripStore";
import HelpTooltip from "../common/HelpTooltip.component";
import TabPanel, { a11yProps } from "../Tabs/TabPanel.component";

enum EVehicleClass{
    class1 = "Class 1",
    class2 = "Class 2",
    class3 = "Class 3",
    class4 = "Class 4"
}

enum EAdditionalCostType{
    R_hr = 1,
    R_100km = 2
}



interface IVehicleListDialog{
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VehicleListDialog: React.FC<IVehicleListDialog> = ({setIsModalOpen}) => {

    const [tabValue, setTabValue] = useState(0)

    const ZF_setVehicle = useTripStore(state => state.actions.setVehicle)

    const [vehicleDescription, setVehicleDescription] = useState("")
    const [vehicleLicencePlate, setVehicleLicencePlate] = useState("")

    const [litersPer100km, setLitersPer100km] = useState("")
    const [additionalCost, setAdditionalCost] = useState("")

    const [additionalCostType, setAdditionalCostType] = useState(EAdditionalCostType.R_hr)
    const [vehicleClass, setVehicleClass] = useState<EVehicleClass>(EVehicleClass.class1)

    const [errorMessage, setErrorMessage] = useState("")

    const utils = trpc.useContext()

    //TRPC - start
    const TM_createVehicle = useCreateVehicleMutation({
        doOnSuccess: () => {
            setVehicleDescription("")
            setVehicleLicencePlate("")
            setLitersPer100km("")
            setAdditionalCost("")
            setAdditionalCostType(EAdditionalCostType.R_hr)
            setVehicleClass(EVehicleClass.class1)
            setTabValue(0)
            setErrorMessage("")

            utils.vehicle.vehicleList.invalidate()
        }
    })

    const TQ_vehicleList = useGetVehicleListQuery()

    const TM_deletetVehicleMutation = useDeletetVehicleMutation({
        doOnSuccess: () => {
            utils.vehicle.vehicleList.invalidate()
        }
    })

    const TM_setLastUsedVehicle = useSetLastUsedVehicleMutation()

    //TRPC - end


    

    function isValidNumber(val: string)
    {
        if(val === "")
        {
            return true
        }
        else
        {
            const regex = /^\d+\.?(\d+)?$/
            return regex.test(val)
        }  
    }

    function saveVehicleToVehicleList()
    {
        
        if(vehicleDescription === "")
        {
            setErrorMessage("No vehicle description provided")
            return;
        }
        if(vehicleLicencePlate === "")
        {
            setErrorMessage("No vehicle licence plate provided")
            return;
        }
        if(litersPer100km === "")
        {
            setErrorMessage("No liters per 100 km provided")
            return;
        }
        if(isValidNumber(litersPer100km) === false)
        {
            setErrorMessage("Invalid liters per 100 km provided")
            return;
        }

        if(additionalCost !== "" && isValidNumber(additionalCost) === false)
        {
            setErrorMessage("Invalid aditional cost provided")
            return;
        }

        console.log("post")

        TM_createVehicle.mutate({
            vehicleDescription: vehicleDescription,
            vehicleLicencePlate: vehicleLicencePlate,
            litersPer100km: parseFloat(litersPer100km),
            additionalCost: additionalCost ? parseFloat(additionalCost) : 0,
            additionalCostType: additionalCostType,
            vehicleClass: vehicleClass
        })
    }

    function selectVehicle(vehicle: IVehicleListEntry)
    {
        ZF_setVehicle(vehicle)
        TM_setLastUsedVehicle.mutate({
            vehicleId: vehicle._id.toString(),
        })
        setIsModalOpen((current) => {return !current})
    }

    return(
        <React.Fragment>
            <DialogTitle color={"primary"} variant="h5">Vehicle List</DialogTitle>
            <DialogContent>

                <Tabs value={tabValue} onChange={(_e, v) => {setTabValue(v)}} aria-label="basic tabs example">
                    <Tab label={"Saved Vehicles"} {...a11yProps(0)}/>
                    <Tab label={"Create New Vehicle"} {...a11yProps(1)}/>

                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Stack spacing={1}>
                        {/* <Box>
                            <Typography color={"primary"} variant="h6">Saved Vehicles:</Typography>
                        </Box> */}

                        {TQ_vehicleList.data?.vehicleList && TQ_vehicleList.data.vehicleList.length > 0  && (
                            <Box>
                                <Stack spacing={1}>
                                    {TQ_vehicleList.data.vehicleList.map((vehicle, index) => {
                                    return(
                                        <Box key={`addressBookEntry-${index}`}>
                                            
                                            <Paper  sx={{width: "100%"}} elevation={0} > 
                                                <Stack direction={"row"} alignItems="center">
                                                    
                                                    <Box sx={{width: "90%"}}>
                                                        <Button onClick={() => {selectVehicle(vehicle)}} sx={{width: "100%", textTransform: "none", justifyContent: "flex-start", textAlign:"left", p: "0.2em", ":hover": {backgroundColor: "#8d8d8d11"}}}>
                                                            <Paper sx={{background: "transparent", width: "100%", height: "100%"}} elevation={0}>
                                                                <Stack>
                                                                    <Typography variant="subtitle1" sx={{color:"#1976d2"}}>{vehicle.vehicleDescription}</Typography>
                                                                    <Typography variant="body2">Licence Plate - {vehicle.vehicleLicencePlate}</Typography>
                                                                    <Typography variant="body2">l/100km - {vehicle.litersPer100km}</Typography>
                                                                    <Typography variant="body2">{vehicle.vehicleClass}</Typography>
                                                                </Stack>
                                                            </Paper>
                                                        </Button>
                                                    </Box>
                                                    <Box sx={{justifyContent:"center", alignItems: "center", display: "flex", width: "10%"}}>
                                                        <Tooltip title={"Delete Entry"}>
                                                            <IconButton onClick={() => {TM_deletetVehicleMutation.mutate({
                                                                vehicleId: vehicle._id.toString()})}}>
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

                        {TQ_vehicleList.data?.vehicleList && TQ_vehicleList.data.vehicleList.length === 0 && (
                            
                            <Box>
                                <Typography variant="subtitle1">No saved vehicles, click on "Create New Vehicle" to add one.</Typography>
                            </Box>
                            
                        )}
                    </Stack>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Stack spacing={1.5}>
                        <Box>
                            <Typography color={"primary"} variant="body1">New Vehicle Details:</Typography>
                        </Box>

                        <Box>
                            <TextField 
                                size="small" 
                                label="Descriptive Vehicle Name"
                                value={vehicleDescription}
                                onChange={(e) => setVehicleDescription(e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Stack direction={"row"} spacing={1} alignItems="center">
                                <Box>
                                    <TextField 
                                        size="small" 
                                        label="Vehicle Licence Plate"
                                        value={vehicleLicencePlate}
                                        onChange={(e) => setVehicleLicencePlate(e.target.value)}
                                    />
                                </Box>
                                <Box>
                                    <HelpTooltip title="Will be used when GPS tracking is implemented in the future to uniquely identify the vehicle."/>
                                </Box>
                            </Stack>
                            
                        </Box>
                        <Box>
                            <TextField 
                                size="small" 
                                label="Liters P100km" 
                                InputProps={{startAdornment: <InputAdornment position="start">l/100km:</InputAdornment>}}
                                value={litersPer100km}
                                onChange={(e) => setLitersPer100km(e.target.value)}
                                error={!isValidNumber(litersPer100km)}
                                />
                        </Box>
                        <Box>
                            <Stack direction={"row"} spacing={1}>
                                <Box>
                                    <TextField 
                                    size="small" 
                                    label="Additional Cost"
                                    InputProps={{startAdornment: <InputAdornment position="start">{additionalCostType === EAdditionalCostType.R_hr ? "R/hr" : "R/100km"}</InputAdornment>}}
                                    value={additionalCost}
                                    onChange={(e) => {setAdditionalCost(e.target.value)}}
                                    error={!isValidNumber(additionalCost)}
                                    />
                                </Box>
                                <Box>
                                    <ToggleButtonGroup
                                        value={additionalCostType}
                                        sx={{maxHeight:"100%", height: "100%"}}
                                        exclusive
                                        size="small"
                                        color="primary"
                                        onChange={(_e, v) => {
                                            if(v !== null)
                                            {
                                                setAdditionalCostType(v)
                                            }
                                        }}
                                        >
                                        <ToggleButton value={EAdditionalCostType.R_hr}>R/hr</ToggleButton>
                                        <ToggleButton value={EAdditionalCostType.R_100km}>R/100km</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Stack>
                            
                        </Box>
                        <Box>
                            <Stack direction={"row"} spacing={1} alignItems="center">
                                <Box>   
                                    <FormControl size="small">
                                        <InputLabel id="demo-simple-select-label">Vehicle Class</InputLabel>
                                        <Select
                                        
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={vehicleClass}
                                        label="Vehicle Class"
                                        onChange={(e) => setVehicleClass(e.target.value as EVehicleClass)}
                                        >
                                        <MenuItem value={EVehicleClass.class1}>Class 1</MenuItem>
                                        <MenuItem value={EVehicleClass.class2}>Class 2</MenuItem>
                                        <MenuItem value={EVehicleClass.class3}>Class 3</MenuItem>
                                        <MenuItem value={EVehicleClass.class4}>Class 4</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box>
                                    <HelpTooltip title={<p>
                                            Will be used to calculate Toll Fees in the future. <br/>
                                            Class 1: Light vehicles <br/>
                                            Class 2: Heavy vehicles with 2 axles (8-16 ton) <br/>
                                            Class 3: Heavy vehicle with 3-4 axles (24-32 ton) <br/>
                                            Class 4: Heavy vehicle with 5 and more axles (up to 56 ton) <br/>
                                        </p>}/>
                                </Box>
                            </Stack>
                            
                        </Box>

                        {errorMessage && (
                            <Box>
                                <p style={{color: "red"}}>{errorMessage}</p>
                            </Box>
                        )}

                        <Box>
                            <Button variant="outlined" onClick={() => saveVehicleToVehicleList()}>Save Vehicle</Button>
                        </Box>
                    </Stack>
                </TabPanel>
            </DialogContent>

            <DialogActions sx={{position: "relative", right: "1.6em", bottom: "1em"}}>
                <Button variant="outlined" onClick={() => {setIsModalOpen((current) => {return !current})}}>Cancel</Button>
            </DialogActions>
        </React.Fragment>
    )
}

export default VehicleListDialog