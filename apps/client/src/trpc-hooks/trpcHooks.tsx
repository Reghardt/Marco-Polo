import { trpc } from "../utils/trpc"

//workspace - start /////////////////////////////////////////////////////////////////////////////////

  export const useGetWorkspacesQuery = () => trpc.workspaces.getWorkspaces.useQuery()

  //Should invaildate getWorkspaces
  export const useCreateNewWorkspaceMutation = (callbacks: {doOnSuccess: () => void} ) => trpc.workspaces.createWorkspace.useMutation({
    onSuccess: () => {
        callbacks.doOnSuccess();
    }
  })

  export const useGetMemberQuery = (workspaceId: string) => trpc.workspaces.getMemberData.useQuery({
      workspaceId: workspaceId
  })

  export const useDoesWorkspaceExistMutation = (onSuccess: (res: { doesExist: boolean}) => void) => trpc.workspaces.doesWorkspaceExist.useMutation({
    onSuccess: (res) => {
      onSuccess(res)

    }
  })

//workspace - end \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//auth - start /////////////////////////////////////////////////////////////////////////////////////////
  export const useloginMsMutation = (callbacks: {
    doOnSuccess: (res: { accessToken: string; lastUsedWorkspaceId: string;}) => void;
    doOnError: (err: any) => void;
  }) => trpc.auth.loginMs.useMutation({
    onSuccess: (res) => {
      callbacks.doOnSuccess(res)
    },
    onError: (err) => {
      callbacks.doOnError(err)
    }
  })

//auth - end \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//Address book - start //////////////////////////////////////////////////////////////////////////////////

  export const useGetAddressBookQuery = (workspaceId: string) => trpc.addressBook.getAddressBook.useQuery(
    {workspaceId: workspaceId},
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  )

  //should invalidate getAddressBook
  export const useCreateAddressBookEntry = (callbacks: {doOnSuccess: () => void}) => trpc.addressBook.createAddressBookEntry.useMutation({
    onSuccess: () => {
        callbacks.doOnSuccess();
    }
  })

  //should invalidate getAddressBook
  export const useDeleteAddressBookEntryMutation = (callbacks: {doOnSuccess: () => void}) => trpc.addressBook.deleteAddressBookEntry.useMutation({
    onSuccess: () => {
        callbacks.doOnSuccess();
    }
  })

//Address book - end \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//vehicle - start ///////////////////////////////////////////////////////////////////////////////////////

  export const useGetVehicleListQuery = (workspaceId: string) => trpc.vehicle.vehicleList.useQuery({workspaceId: workspaceId})

  //should invalidate vehicle list
  export const useCreateVehicleMutation = (callbacks: {doOnSuccess: () => void}) => trpc.vehicle.createVehicle.useMutation({
    onSuccess: () => {
        callbacks.doOnSuccess()
    }
  })

  //should invalidate vehicle list
  export const useDeletetVehicleMutation = (callbacks: {doOnSuccess: () => void}) => trpc.vehicle.deleteVehicle.useMutation({
    onSuccess: () => {
        callbacks.doOnSuccess()
    }
  })

  export const useGetVehicleByIdQuery = (workspaceId: string ,vehicleId: string) => trpc.vehicle.getVehicleById.useQuery({
      workspaceId: workspaceId,
      vehicleId: vehicleId
  },
  {
      enabled: !!vehicleId
  })

  export const useSetFuelPriceMutation = () => trpc.vehicle.setFuelPrice.useMutation()

  export const useSetLastUsedVehicleMutation = () => trpc.vehicle.setLastUsedVehicle.useMutation()

//vehicle - end \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\











