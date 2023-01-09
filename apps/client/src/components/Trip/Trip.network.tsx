import { useGetMemberQuery, useGetVehicleByIdQuery } from "../../trpc-hooks/trpcHooks"
import { useAccountStore } from "../../Zustand/accountStore"



export const TripNetwork: React.FC = () => {

  //TODO use interface to define inputs, to make it more readable
    const memberQuery = useGetMemberQuery(useAccountStore.getState().values.workspaceId)
    console.log(memberQuery.data)
  
    const TQ_vehicleQuery = useGetVehicleByIdQuery(useAccountStore.getState().values.workspaceId, memberQuery.data?.lastUsedVehicleId ? memberQuery.data.lastUsedVehicleId : "")
    console.log(TQ_vehicleQuery.data)
    
    return(
        <>

        </>
    )
}

