import { useQuery } from "@tanstack/react-query"
import { EQueryKeys, getVehicleByIdQuery, getWorkspaceMemberByUserIdQuery } from "../../Queries"

export const useGetMemberQuery = () => useQuery({
    queryKey: [EQueryKeys.member],
    queryFn: getWorkspaceMemberByUserIdQuery
  })
  
  export const useGetVehicleByIdQuery = (vehicleId: string) => useQuery({
    //queryKey: [EQueryKeys.vehicle],
    queryFn: () => getVehicleByIdQuery(vehicleId),
    enabled: !!vehicleId //read about !!
  })

export const TripNetwork: React.FC = () => {

    const memberQuery = useGetMemberQuery()
    console.log(memberQuery.data?.data)
  
    const vehicleQuery = useGetVehicleByIdQuery(memberQuery.data?.data?.lastUsedVehicleId ? memberQuery.data.data.lastUsedVehicleId : "")
    console.log(vehicleQuery.data)
    
    return(
        <>

        </>
    )
}

