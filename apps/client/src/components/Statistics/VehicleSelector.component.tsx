import { Typography } from "@mui/material"
import { useEffect } from "react"
import { useGetMemberDataQuery, useGetVehicleByIdQuery } from "../../trpc-hooks/trpcHooks"
import { useTripStore } from "../../Zustand/tripStore"
import VehicleList from "../VehicleList/VehicleList.component"

interface IVehicleSelectorProps{
    setFuelPrice: React.Dispatch<React.SetStateAction<string>>,
    setLitersKm: React.Dispatch<React.SetStateAction<string>>
}

const VehicleSelector: React.FC<IVehicleSelectorProps> = ({setLitersKm, setFuelPrice}) => {


    const ZF_setVehicle = useTripStore(state => state.actions.setVehicle)
    const Z_vehicle = useTripStore(state => state.data.vehicle)

    const vehicle = useTripStore(state => state.data.vehicle)

    const memberQuery = useGetMemberDataQuery()
    const vehicleQuery = useGetVehicleByIdQuery(memberQuery.data?.lastUsedVehicleId ? memberQuery.data.lastUsedVehicleId : "")

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
        </>
    )
}

export default VehicleSelector