import { trpc } from "../utils/trpc"

//workspace - start /////////////////////////////////////////////////////////////////////////////////

  export const useGetWorkspacesQuery = () => trpc.workspaces.getWorkspaces.useQuery()

  //Should invaildate getWorkspaces
  export const useCreateNewWorkspaceMutation = (callbacks: {doOnSuccess: () => void} ) => trpc.workspaces.createWorkspace.useMutation({
    onSuccess: () => {
        callbacks.doOnSuccess();
    }
  })

  //get data associated with a member of a workspace, like role, last used fuel price etc
  export const useGetMemberDataQuery = () => trpc.workspaces.getMemberData.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false
    }
  )

  export const useDoesWorkspaceExistMutation = (onSuccess: (res: { doesExist: boolean}) => void) => trpc.workspaces.doesWorkspaceExist.useMutation({
    onSuccess: (res) => {
      onSuccess(res)
    }
  })

  export const useSetLastUsedWorkspace = (callbacks: {doOnSuccess: (res: string) => void}) => trpc.workspaces.setActiveWorkspace.useMutation({
    onSuccess: (res) => {
      callbacks.doOnSuccess(res)
    }
  })

//workspace - end \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//auth - start /////////////////////////////////////////////////////////////////////////////////////////
  export const useloginMsMutation = (callbacks: {
    doOnSuccess: (res: { accessToken: string;}) => void;
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

  export const useGetAddressBookQuery = () => trpc.addressBook.getAddressBook.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      // refetchOnMount: false //if the user switches workspaces will the new addressbook be fetched?
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

  export const useGetVehicleListQuery = () => trpc.vehicle.vehicleList.useQuery()

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

  export const useGetVehicleByIdQuery = (vehicleId: string) => trpc.vehicle.getVehicleById.useQuery({
      vehicleId: vehicleId
  },
  {
      enabled: !!vehicleId,
      refetchOnWindowFocus: false,
  })

  export const useSetFuelPriceMutation = () => trpc.vehicle.setFuelPrice.useMutation()

  export const useSetLastUsedVehicleMutation = () => trpc.vehicle.setLastUsedVehicle.useMutation()

//vehicle - end \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//driver - start //////////////////////////////////////////////////////////////////////////////////////////

  export const useAddDriverMutation = (callbacks: {doOnSuccess: () => void}) => trpc.driver.addDriver.useMutation({
    onSuccess: () => {
      callbacks.doOnSuccess()
    }
  })

  export const useGetDriversQuery = () => trpc.driver.getDrivers.useQuery()

  export const useSendTripToDriver = (callbacks: {doOnSuccess: () => void}) => trpc.driver.sendTripToDriver.useMutation({
    onSuccess: () => {
      callbacks.doOnSuccess()
    }
  })

//driver - end \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\











