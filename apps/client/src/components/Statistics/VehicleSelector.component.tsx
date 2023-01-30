import { Button, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect } from "react"
import { isFloat } from "../../Services/Statistics.service"
import { useGetMemberDataQuery, useGetVehicleByIdQuery, useSetFuelPriceMutation } from "../../trpc-hooks/trpcHooks"
import { useTripStore } from "../../Zustand/tripStore"
import VehicleList from "../VehicleList/VehicleList.component"

interface IVehicleSelectorProps{
    setFuelPrice: React.Dispatch<React.SetStateAction<string>>,
    setLitersKm: React.Dispatch<React.SetStateAction<string>>
    fuelPrice: string;
    litersKm: string;
}

const VehicleSelector: React.FC<IVehicleSelectorProps> = ({setLitersKm, setFuelPrice, fuelPrice, litersKm}) => {


    const ZF_setVehicle = useTripStore(state => state.actions.setVehicle)
    const Z_vehicle = useTripStore(state => state.data.vehicle)

    const vehicle = useTripStore(state => state.data.vehicle)

    const memberQuery = useGetMemberDataQuery()
    const vehicleQuery = useGetVehicleByIdQuery(memberQuery.data?.lastUsedVehicleId ? memberQuery.data.lastUsedVehicleId : "")

    const TM_fuelPriceMutation = useSetFuelPriceMutation()

    useEffect( () => {
        if(vehicleQuery.data?.vehicle)
        {
            ZF_setVehicle(vehicleQuery.data.vehicle)
            setLitersKm(vehicleQuery.data.vehicle.litersPer100km.toString())
        }
    }, [vehicleQuery.isFetched])

    useEffect(() => {
        if(Z_vehicle)
        {
            setLitersKm(Z_vehicle.litersPer100km.toString())
        }
        
    }, [Z_vehicle])

    useEffect(() => {
        if(memberQuery.data?.lastUsedFuelPrice)
        {
            setFuelPrice(memberQuery.data?.lastUsedFuelPrice.toString())
        }

    }, [memberQuery.isFetched])

    function handleSetLitersKm(litersKm: string)
    {
        setLitersKm(litersKm)
        ZF_setVehicle(null)

    }

    function handleUseSetFuelPriceMutation(fuelPrice: string)
    {
        if(isFloat(fuelPrice))
        {
            TM_fuelPriceMutation.mutate({fuelPrice: fuelPrice})
        }
    }

    
    
    return (
        <>
            Vehicle Selector
            <VehicleList/>

            

            {vehicle && (
                <div>
                    <Typography variant="body1">Current Vehicle:</Typography>
                    <Typography variant="body1">{vehicle.vehicleDescription} - {vehicle.vehicleLicencePlate} - {vehicle.vehicleClass}</Typography>

                </div>
            )}

            {vehicle === null && (
                <div>
                    <Typography variant="body1">Current Vehicle:</Typography>
                    <Typography variant="body1" sx={{fontStyle: "italic"}}>custom</Typography>

                </div>
            )}

            <div>
                <TextField
                label="Liters per 100 km"
                id="outlined-size-small"
                //defaultValue=""
                size="small"
                sx={{width: '25ch'}}
                onChange={(e) => handleSetLitersKm(e.target.value)}
                value={litersKm}
                error={!isFloat(litersKm)}
                InputProps={{startAdornment: <InputAdornment position="start">l/100km:</InputAdornment>}}
                />
            </div>

            <div>
                <div>
                    <div>
                        <TextField
                        label="Fuel Price"
                        id="outlined-size-small"
                        //defaultValue=""
                        size="small"
                        sx={{width: '25ch'}}
                        onChange={(e) => setFuelPrice(e.target.value)}
                        value={fuelPrice}
                        error={!isFloat(fuelPrice)}
                        InputProps={{startAdornment: <InputAdornment position="start">R</InputAdornment>}}
                        />
                    </div>
                    <div>
                        <Button onClick={() => handleUseSetFuelPriceMutation(fuelPrice)} sx={{height: "100%"}} variant="outlined">Save Price</Button>
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default VehicleSelector