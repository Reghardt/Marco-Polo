import { EColumnDesignations, IAddress, ICell, IRow } from "../Components/common/CommonInterfacesAndEnums";
import create from 'zustand';
import produce from 'immer';
import { areAllAddressesInColumnValidAndAccepted, makeRowParentChildRelations, removeRowParentChildRelations } from "../Services/Trip.service";
import { IVehicleListEntry } from "trpc-server/trpc/models/Workspace";
import { WritableDraft } from "immer/dist/internal";
import { TMouldedDirections } from "../Services/GMap.service";
import { preSyncRowDataForDeletion } from "../Components/Trip/TripTable/WriteBack/WriteBack.service";


export enum EDepartReturn{
    return,
    different
}

export enum ETableMode{
    EditMode = 1,
    AddressSolveMode = 2,
    LinkAddressSolveMode = 3
}

function getAddressColumn(columnDesignations: EColumnDesignations[])
{
    for(let i = 0; i < columnDesignations.length; i++)
    {
        if(columnDesignations[i] === EColumnDesignations.Address)
        {
            return i;
        }
    }
    return -1;
}

function getLinkAddressColumn(columnDesignations: EColumnDesignations[])
{
    for(let i = 0; i < columnDesignations.length; i++)
    {
        if(columnDesignations[i] === EColumnDesignations.LinkAddress)
        {
            return i;
        }
    }
    return -1;
}


//sets the column to the desired designation. Changes the table mode if an address needs to be solved
function updateColumnDesignationHelper(state: WritableDraft<ITripState>, payload: {columnIndex: number, designation: EColumnDesignations})
{
    //set all columns that match the designation to data. This is necesarry for if a column designation is moved from one column to the other. The previous designation has to be cleared
    for(let i = 0; i < state.data.columnDesignations.length; i++)
    {
        if(state.data.columnDesignations[i] === payload.designation)
        {
            state.data.columnDesignations[i] = EColumnDesignations.Data
            break;
        }
    }
    state.data.columnDesignations[payload.columnIndex] = payload.designation //set column designation. 

    //check if addresses in column needs solving, if so, enter the appropriate solve mode
    for(let i = 0; i < state.data.rows.length; i++)
    {
        const cell = state.data.rows[i]?.cells[payload.columnIndex];
        if(cell?.address.isAddressAccepted === false)
        {
            state.data.tabelMode = payload.designation === EColumnDesignations.Address ? ETableMode.AddressSolveMode : ETableMode.LinkAddressSolveMode;
            break;
        }
    }
}

function makeFormattedAddressDisplayData(rows: WritableDraft<IRow>[], columnIndex: number)
{
    for(let i = 0; i < rows.length; i++)
    {
        const row = rows[i]
        if(row)
        {
            const cell = row.cells[columnIndex]
            if(cell)
            {
                cell.displayData = cell.address.formatted_address
            }
        }
    }
}



interface ITrip{
    departureAddress: IAddress | null;
    returnAddress: IAddress | null;
    departureReturnState: EDepartReturn;

    columnDesignations: EColumnDesignations[];
    columnVisibility: boolean[];
    rows: IRow[];
    addressColumnIndex: number; 
    linkAddressColumnIndex: number;

    tripDirections: TMouldedDirections | null;

    vehicle: IVehicleListEntry | null;
    errorMessage: string;

    tabelMode: ETableMode;
}

interface ITripState {
    data: ITrip
    actions: {
        setDepartureAddress: (departureAddress: IAddress) => void;
        setReturnAddress: (returnAddress:IAddress) => void;
        setDepartureReturnState: (departureReturnState: EDepartReturn) => void;

        setRowsAsNewTrip: (rows: IRow[]) => void;
        setTripRows: (rows: IRow[]) => void;
        updateBodyCell: (payload: ICell) => void;
        updateColumnDesignation: (payload: {columnIndex: number, designation: EColumnDesignations}) => void;
        updateColumnVisibility: (columnIndex: number) => void;
        deleteRow: (rowYCoord: number) => void;
        appendRows: (rows: IRow[], enterSolveMode: boolean) => void;
        reverseRows: () => void;

        setRowOrderPerWaypoints: (waypoints: number[]) => void;
        clearAndSetTripDirections: (tripDirections: TMouldedDirections | null) => void;

        setVehicle: (vehicle: IVehicleListEntry | null) => void;

        setErrorMessage: (msg: string) => void;

        setTableMode: (tableMode: ETableMode) => void;
    }
}

export const useTripStore = create<ITripState>()(((set) => ({
    data: {
        departureAddress: null,
        returnAddress: null,
        departureReturnState: EDepartReturn.return,

        columnDesignations: [],
        columnVisibility: [],
        rows: [],
        addressColumnIndex: -1,
        linkAddressColumnIndex: -1,
        tripDirections: null,

        vehicle: null,

        errorMessage: "",
        tabelMode: ETableMode.EditMode
    },
    actions: {
        setDepartureAddress(departureAddress) {
            set(produce<ITripState>((state) => {
                state.data.departureAddress = departureAddress;
                if(state.data.departureReturnState === EDepartReturn.return)
                {
                    state.data.returnAddress = departureAddress;
                }
            }))
        },
        setReturnAddress(returnAddress) {
            set(produce<ITripState>((state) => {
                state.data.returnAddress = returnAddress;
            }))
        },
        setDepartureReturnState(departureReturnState) {
            set(produce<ITripState>((state) => {
                state.data.departureReturnState = departureReturnState;
                if(departureReturnState === EDepartReturn.return)
                {
                    state.data.returnAddress = state.data.departureAddress;
                }
            }))
        },
        setRowsAsNewTrip(payload) {
            set(produce<ITripState>((state) => {
                const rowLength = payload[0]?.cells.length
                if(rowLength)
                {
                    state.data.columnDesignations = new Array<EColumnDesignations>(rowLength).fill(EColumnDesignations.Data)
                    state.data.columnVisibility = new Array<boolean>(rowLength).fill(true)
                    state.data.rows = payload;
                    state.data.addressColumnIndex = -1;
                    state.data.linkAddressColumnIndex = -1;
                    // state.data.tripDirections = null;
                    state.data.tabelMode = ETableMode.EditMode
                }
                else
                {
                    state.data.columnDesignations = []
                    state.data.columnVisibility = []
                    state.data.rows = [];
                    state.data.addressColumnIndex = -1;
                    state.data.linkAddressColumnIndex = -1;
                    // state.data.tripDirections = null;
                    state.data.tabelMode = ETableMode.EditMode
                }

            }))
        },
        setTripRows(rows) {
            set(produce<ITripState>((state) => {
                state.data.rows = rows
            }))
        },
        updateBodyCell(payload) {
            set(produce<ITripState>((state) => {
                const cell = payload
                cell.displayData = cell.displayData.trim();
                for(let i = 0; i < state.data.rows.length; i++) //loops over rows
                {
                    const row = state.data.rows[i]
                    if(row?.cells[0] && row.cells[0].y === cell.y) //if the row of the desired cell is found, loop over row until the desired cell is found
                    {
                        for(let j = 0; j < row.cells.length; j++) //loops over cells
                        {
                            const cellInRow = row.cells[j]
                            if(cellInRow?.x === cell.x) //if x coordinate of cell matches, cell is found
                            {
                                console.log("cell found")
                                if(state.data.rows[i]?.cells[j])
                                {
                                    state.data.rows[i]!.cells[j] = cell

                                    if(state.data.tabelMode === ETableMode.AddressSolveMode && state.data.addressColumnIndex === j)
                                    {
                                        if(areAllAddressesInColumnValidAndAccepted(j, state.data.rows, state.data.tabelMode)) 
                                        {
                                            if(state.data.linkAddressColumnIndex > -1 && !areAllAddressesInColumnValidAndAccepted(state.data.linkAddressColumnIndex, state.data.rows, ETableMode.LinkAddressSolveMode))
                                            {
                                                makeFormattedAddressDisplayData(state.data.rows, state.data.addressColumnIndex) //address column was just confirmed, execute function on that column
                                                state.data.tabelMode = ETableMode.LinkAddressSolveMode //then set mode to link address solve mode
                                                
                                            }
                                            else
                                            {
                                                makeFormattedAddressDisplayData(state.data.rows, state.data.addressColumnIndex)
                                                state.data.tabelMode = ETableMode.EditMode
                                                
                                            }
                                            
                                        }
                                    }
                                    else if(state.data.tabelMode === ETableMode.LinkAddressSolveMode && state.data.linkAddressColumnIndex === j)
                                    {
                                        if(areAllAddressesInColumnValidAndAccepted(j, state.data.rows, state.data.tabelMode)) 
                                        {
                                            makeFormattedAddressDisplayData(state.data.rows, state.data.linkAddressColumnIndex)
                                            state.data.tabelMode = ETableMode.EditMode
                                        }
                                    }
                                }
                                
                                return;
                            }
                        }
                    }
                }
                console.error("cell not found")
            }))
        },
        updateColumnDesignation(payload) {
            set(produce<ITripState>((state) => {
                if(payload.columnIndex > -1 && payload.columnIndex < state.data.columnDesignations.length)
                {
                    if(payload.designation === EColumnDesignations.Data) //if designation is data, simply assign it as such
                    {
                        state.data.columnDesignations[payload.columnIndex] = payload.designation
                        state.data.tabelMode = ETableMode.EditMode;
                    }
                    else // column either set to address or goToAddress
                    {
                        updateColumnDesignationHelper(state, payload)
                    }
                    
                    //get both the address column and goToAddress column as one might have been set to the other and have thus been over written
                    state.data.addressColumnIndex = getAddressColumn(state.data.columnDesignations); //save the new address columns index
                    state.data.linkAddressColumnIndex = getLinkAddressColumn(state.data.columnDesignations); //save the new to address columns index
                    state.data.rows = makeRowParentChildRelations(removeRowParentChildRelations(state.data.rows), state.data.addressColumnIndex) //new parent child relations may be needed, recalculate them
                }
            }))
        },
        updateColumnVisibility(columnIndex) {
            set(produce<ITripState>((state) => {
                if(columnIndex > -1 && columnIndex < state.data.columnVisibility.length)
                {
                    state.data.columnVisibility[columnIndex] = !state.data.columnVisibility[columnIndex]
                }
            }))
        },
        deleteRow(rowYCoord) {
            set(produce<ITripState>((state) => {
                for(let i = 0; i < state.data.rows.length; i++)
                {
                    const row = state.data.rows[i];
                    if(row?.cells[0] && row.cells[0].y === rowYCoord)
                    {
                        const deletedRow = JSON.parse(JSON.stringify(state.data.rows.splice(i, 1))) 
                        Excel.run(async (context) => {
                            const sheet = context.workbook.worksheets.getActiveWorksheet()
                            for(let j = 0; j < deletedRow.length; j++)
                            {   
                                preSyncRowDataForDeletion(deletedRow[j], sheet)
                            }
                            await context.sync()
                        })
                    }
                }
            }))
        },
        appendRows(rows, enterSolveMode) {
            set(produce<ITripState>((state) => {
                console.log("append fired")
                const parentChildRowsToAdd = makeRowParentChildRelations(rows, state.data.addressColumnIndex)
                console.log(parentChildRowsToAdd)
                state.data.rows = [...state.data.rows, ...parentChildRowsToAdd]
                if(enterSolveMode)
                {
                    state.data.tabelMode = ETableMode.AddressSolveMode
                }
                
            }))
        },
        reverseRows() {
            set(produce<ITripState>((state) => {
                state.data.rows.reverse()
            }))
        },
        setRowOrderPerWaypoints(waypoints) {
            set(produce<ITripState>((state) => {
                const inSequenceRows: IRow[] = [];
                for(const waypoint of waypoints)
                {
                    const row = state.data.rows[waypoint]
                    if(row)
                    inSequenceRows.push(row)
                }
                state.data.rows = inSequenceRows;
            }))
        },
        clearAndSetTripDirections(tripDirections) {
            set(produce<ITripState>((state) => {
                if(state.data.tripDirections)
                {
                    state.data.tripDirections.legGroups.forEach(group => {
                        group.legs.forEach(leg => {
                            leg.polyLine?.setMap(null)
                        })
                    })
                }
                state.data.tripDirections = tripDirections
            }))
        },

        setVehicle(vehicle) {
            set(produce<ITripState>((state) => {
                state.data.vehicle = vehicle
            }))
        },

        setErrorMessage(msg) {
            set(produce<ITripState>((state) => {
                state.data.errorMessage = msg;
            }))
        },

        setTableMode(tabelMode){
            set(produce<ITripState>((state) => {
                state.data.tabelMode = tabelMode
            }))
        }
    }
})))






