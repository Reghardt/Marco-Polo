import axios from "axios";
import { IVehicleListEntry } from "trpc-server/trpc/models/Workspace";
import { IAddressBookEntry, IWorkspace } from "./Components/common/CommonInterfacesAndEnums";
import { INewAddress } from "./Components/Trip/DepartureReturn/AddressBookDialog.component";
import { useAccountStore } from "./Zustand/accountStore";

export enum EQueryKeys{
  member,
  vehicleList,
  addressBook,
  myWorkspaces
}

export function getWorkspaceMemberByUserIdQuery()
{
    const Z_workspaceId = useAccountStore.getState().values.workspaceId
    const Z_bearer = useAccountStore.getState().values.bearer

    return axios.post<{memberId: string, memberRole: string, lastUsedVehicleId: string, lastUsedFuelPrice: number}>
    ("/api/workspace/getWorkspaceMemberByUserId", {
        workspaceId: Z_workspaceId,
    },
    {
        headers: {authorization: Z_bearer} //for user id
    }
    )
}

// export function getVehicleListQuery()
// {   
//     const Z_workspaceId = useAccountStore.getState().values.workspaceId
//     const Z_bearer = useAccountStore.getState().values.bearer

//     return axios.post<{vehicleList: IVehicleListEntry[]}>( "/api/workspace/vehicleList", {
//         workspaceId: Z_workspaceId
//       },
//       {
//         headers: {authorization: Z_bearer}
//       }
//     )
// }

// export function deleteVehicleFromListMutation(vehicleId: string)
// {
//     const Z_workspaceId = useAccountStore.getState().values.workspaceId
//     const Z_bearer = useAccountStore.getState().values.bearer

//     return axios.post<void>( "/api/workspace/deletVehicleFromList", {
//         workspaceId: Z_workspaceId,
//         vehicleId: vehicleId
//       },
//       {
//         headers: {authorization: Z_bearer}
//       })
// }

// export function setLastUsedVehicleMutation(vehicleId: string)
// {
//     const Z_workspaceId = useAccountStore.getState().values.workspaceId
//     const Z_bearer = useAccountStore.getState().values.bearer

//     console.log("set last used vehicle fired", Z_workspaceId, vehicleId)
//     return  axios.post<void>( "/api/workspace/setLastUsedVehicle", {
//         workspaceId: Z_workspaceId,
//         vehicleId: vehicleId
//       },
//       {
//         headers: {authorization: Z_bearer}
//       }
//     )
// }


export function getVehicleByIdQuery(vehicleId: string)
{
  const Z_workspaceId = useAccountStore.getState().values.workspaceId
  const Z_bearer = useAccountStore.getState().values.bearer
  return axios.post<{vehicle: IVehicleListEntry}>
        ("/api/workspace/getVehicleById", {
            workspaceId: Z_workspaceId,
            vehicleId: vehicleId
          },
          {
            headers: {authorization: Z_bearer} //for user id
          }
        )
}

export function setFuelPriceMutation(fuelPrice: string)
{
  const Z_workspaceId = useAccountStore.getState().values.workspaceId
  const Z_bearer = useAccountStore.getState().values.bearer

  return axios.post("/api/workspace/saveFuelPrice", 
  {
      workspaceId: Z_workspaceId,
      fuelPrice: fuelPrice
  },
  {
      headers: {authorization: Z_bearer} //for user id
  })
}

export async function getAddressBookQuery()
{
  const Z_workspaceId = useAccountStore.getState().values.workspaceId
  const Z_bearer = useAccountStore.getState().values.bearer

  return await axios.post<{addressBookEntries: IAddressBookEntry[]}>( "/api/workspace/addressBook", {
    workspaceId: Z_workspaceId
  },
  {
    headers: {authorization: Z_bearer}
  })

}

export async function createAddressBookEntryMutation({physicalAddress, addressDescription}: INewAddress)
{
  const Z_workspaceId = useAccountStore.getState().values.workspaceId
  const Z_bearer = useAccountStore.getState().values.bearer

  return await axios.post( "/api/workspace/createAddressBookEntry", {
    workspaceId: Z_workspaceId,
    physicalAddress: physicalAddress,
    addressDescription: addressDescription
  },
  {
    headers: {authorization: Z_bearer}
  })
}

export async function deleteAddressBookEntryMutation(entryId: string)
{
  const Z_workspaceId = useAccountStore.getState().values.workspaceId
  const Z_bearer = useAccountStore.getState().values.bearer

  return await axios.post( "/api/workspace/deleteAddressBookEntry", {
    workspaceId: Z_workspaceId,
    addressBookEntryId: entryId
  },
  {
    headers: {authorization: Z_bearer}
  })
}

interface INewWorkspace{
  workspaceName: string;
  descriptionPurpose: string;
}

export async function createNewWorkspaceMutation({workspaceName, descriptionPurpose}: INewWorkspace)
{
  const Z_bearer = useAccountStore.getState().values.bearer

  return await axios.post("/api/workspace/new",
        {
            workspaceName: workspaceName,
            descriptionPurpose: descriptionPurpose
        },
        {
            headers: {authorization: Z_bearer}
        })
}

export async function getWorkspacesQuery()
{
  const Z_bearer = useAccountStore.getState().values.bearer

  return axios.post<IWorkspace[]>("/api/workspace/userWorkspaceList",
    {},
    {
        headers: {authorization: Z_bearer}
    })
}


