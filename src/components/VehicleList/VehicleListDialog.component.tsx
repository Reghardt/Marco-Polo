import { DeleteOutline } from "@mui/icons-material";
import { Button, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil";
import { RSBearerToken, RSSelectedVehicle, RSWorkspaceID } from "../../state/globalstate";
import HelpTooltip from "../common/HelpTooltip.component";

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

export interface IVehicleListEntry{
    _id: string;
    vehicleDescription: string;
    vehicleLicencePlate: string;
    litersPer100km: number;
    additionalCost: number;
    additionalCostType: number; // 1 = R/hr, 2 = R/100km
    vehicleClass: string;
}

interface IVehicleListDialog{
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VehicleListDialog: React.FC<IVehicleListDialog> = ({setIsModalOpen}) => {

    const [R_selectedVehicle, R_setSelectedVehicle] = useRecoilState(RSSelectedVehicle)

    const [vehicleList, setVehicleList] = useState<IVehicleListEntry[]>([])

    const [vehicleDescription, setVehicleDescription] = useState("")
    const [vehicleLicencePlate, setVehicleLicencePlate] = useState("")

    const [litersPer100km, setLitersPer100km] = useState("")
    const [additionalCost, setAdditionalCost] = useState("")

    const [additionalCostType, setAdditionalCostType] = useState(EAdditionalCostType.R_hr)
    const [vehicleClass, setVehicleClass] = useState<EVehicleClass>(EVehicleClass.class1)

    const [errorMessage, setErrorMessage] = useState("")

    const R_workspaceId = useRecoilValue(RSWorkspaceID)
    const bearer = useRecoilValue(RSBearerToken)

    useEffect(() => {
        getVehicleList()
    }, [])
    

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
        axios.post( "/api/workspace/createVehicleListEntry", {
            workspaceId: R_workspaceId,
            vehicleDescription: vehicleDescription,
            vehicleLicencePlate: vehicleLicencePlate,
            litersPer100km: parseFloat(litersPer100km),
            additionalCost: additionalCost === "" ? 0 : parseFloat(additionalCost),
            additionalCostType: additionalCostType,
            vehicleClass: vehicleClass

          },
          {
            headers: {authorization: bearer}
          }).then(res => {
            console.log(res)
            getVehicleList()
            setVehicleDescription("")
            setVehicleLicencePlate("")
            setLitersPer100km("")
            setAdditionalCost("")
            setAdditionalCostType(EAdditionalCostType.R_hr)
            setVehicleClass(EVehicleClass.class1)

          }).catch(err => {
            console.error(err)
          }
        )
        setErrorMessage("")
    }

    function getVehicleList()
    {   
        axios.post<{vehicleList: IVehicleListEntry[]}>( "/api/workspace/vehicleList", {
            workspaceId: R_workspaceId
          },
          {
            headers: {authorization: bearer}
          }).then(res => {
            console.log(res.data.vehicleList)
            setVehicleList(res.data.vehicleList)
          }).catch(err => {
            console.error(err)
          }
        )
    }

    function deleteVehicleFromList(vehicleId: string)
    {
        axios.post( "/api/workspace/deletVehicleFromList", {
            workspaceId: R_workspaceId,
            vehicleId: vehicleId
          },
          {
            headers: {authorization: bearer}
          }).then(res => {
            console.log(res)
            getVehicleList()
          }).catch(err => {
            console.error(err)
          }
        )
    }



    function setLastUsedVehicle(vehicleId: string)
    {
        axios.post( "/api/workspace/setLastUsedVehicle", {
            workspaceId: R_workspaceId,
            vehicleId: vehicleId
          },
          {
            headers: {authorization: bearer}
          }).then(res => {
            console.log(res)

          }).catch(err => {
            console.error(err)
          }
        )
    }

    function selectVehicle(vehicle: IVehicleListEntry)
    {
        
        R_setSelectedVehicle(vehicle)
        setLastUsedVehicle(vehicle._id)
        setIsModalOpen((current) => {return !current})
    }

    return(
        <React.Fragment>
            <DialogTitle color={"primary"} variant="h5">Vehicle List</DialogTitle>
            <DialogContent>

                <Stack spacing={1}>
                    <Box>
                        <Typography color={"primary"} variant="h6">Saved Vehicles:</Typography>
                    </Box>

                    {vehicleList.length > 0 && (
                        <Box>
                            <Stack spacing={1}>
                                {vehicleList.map((vehicle, index) => {
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
                                                        <IconButton onClick={() => {deleteVehicleFromList(vehicle._id)}}>
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

                    {vehicleList.length === 0 && (
                        
                        <Box>
                            <Typography variant="subtitle1">No saved vehicles, create one below</Typography>
                        </Box>
                        
                    )}
                </Stack>

                <Divider sx={{marginTop: "2em", marginBottom: "1em"}}></Divider>

                <Stack spacing={1.5}>

                    <Box>
                        <Typography color={"primary"} variant="h6">Create New Vehicle</Typography>
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
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={() => {setIsModalOpen((current) => {return !current})}}>Cancel</Button>
            </DialogActions>
        </React.Fragment>
    )
}

export default VehicleListDialog