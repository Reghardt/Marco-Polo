import { useGetMemberDataQuery, useGetVehicleByIdQuery } from "../../trpc-hooks/trpcHooks"

export const TripNetwork: React.FC = () => {

    const memberQuery = useGetMemberDataQuery()
    console.log(memberQuery.data)
  
    const TQ_vehicleQuery = useGetVehicleByIdQuery(memberQuery.data?.lastUsedVehicleId ? memberQuery.data.lastUsedVehicleId : "")
    console.log(TQ_vehicleQuery.data)
    
    return(
        <></>
    )
}

