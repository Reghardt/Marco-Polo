import { EColumnDesignations, ICell, IRow, ITripDirections } from "../Components/common/CommonInterfacesAndEnums";
import create from 'zustand';
import produce from 'immer';
import { makeRowParentChildRelations, preSyncRowDataForDeletion, removeRowParentChildRelations } from "../Services/Trip.service";
import { IVehicleListEntry } from "trpc-server/trpc/models/Workspace";


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

export enum EDepartReturn{
    return,
    different
}

export enum ETableMode{
    EditMode = 1,
    SolveAddressMode = 2,
}

interface ITrip{
    departureAddress: google.maps.GeocoderResult | null;
    returnAddress: google.maps.GeocoderResult | null;
    departureReturnState: EDepartReturn;

    columnDesignations: EColumnDesignations[];
    columnVisibility: boolean[];
    rows: IRow[];
    addressColumnIndex: number; 

    tripDirections: ITripDirections | null;

    vehicle: IVehicleListEntry | null;
    errorMessage: string;

    tabelMode: ETableMode;
}

interface ITripState {
    data: ITrip
    reducers: {
        setDepartureAddress: (departureAddress: google.maps.GeocoderResult) => void;
        setReturnAddress: (returnAddress: google.maps.GeocoderResult) => void;
        setDepartureReturnState: (departureReturnState: EDepartReturn) => void;

        setRowsAsNewTrip: (rows: IRow[]) => void;
        setTripRows: (rows: IRow[]) => void;
        updateBodyCell: (payload: ICell) => void;
        updateColumnDesignation: (payload: {columnIndex: number, designation: EColumnDesignations}) => void;
        updateColumnVisibility: (columnIndex: number) => void;
        deleteRow: (rowYCoord: number) => void;
        appendRows: (rows: IRow[]) => void;
        reverseRows: () => void;

        setRowOrderPerWaypoints: (waypoints: number[]) => void;
        setTripDirections: (tripDirections: ITripDirections) => void;

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
        tripDirections: null,

        vehicle: null,

        errorMessage: "",
        tabelMode: ETableMode.EditMode
    },
    reducers: {
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
                const rowLength = payload[0].cells.length
                state.data.columnDesignations = new Array<EColumnDesignations>(rowLength).fill(EColumnDesignations.Data)
                state.data.columnVisibility = new Array<boolean>(rowLength).fill(true)
                state.data.rows = payload;
                state.data.addressColumnIndex = -1

                state.data.tripDirections = null;
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
                    if(row.cells[0].y === cell.y) //if the row of the desired cell is found, loop over row until the desired cell is found
                    {
                        for(let j = 0; j < row.cells.length; j++) //loops over cells
                        {
                            const cellInRow = row.cells[j]
                            if(cellInRow.x === cell.x) //if x coordinate of cell matches, cell is found
                            {
                                console.log("cell found")
                                state.data.rows[i].cells[j] = cell
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
                    else if(payload.designation === EColumnDesignations.Address) // if it is an address, loop through the current designations, set the current column designated as address to data, then set the new specified column as the address
                    {
                        //if its the first time a column is set as address the loop will fall through
                        for(let i = 0; i < state.data.columnDesignations.length; i++)
                        {
                            if(state.data.columnDesignations[i] === EColumnDesignations.Address)
                            {
                                state.data.columnDesignations[i] = EColumnDesignations.Data
                                break;
                            }
                        }
                        state.data.columnDesignations[payload.columnIndex] = payload.designation

                        //check if addresses in column needs solving, if so, enter solve mode
                        for(let i = 0; i < state.data.rows.length; i++)
                        {
                            const cell = state.data.rows[i].cells[payload.columnIndex];
                            if(cell.isAddressValidAndAccepted === false)
                            {
                                state.data.tabelMode = ETableMode.SolveAddressMode;
                                console.log("Solve address mode")
                                break;
                            }
                        }
                    }                
                    
                    state.data.addressColumnIndex = getAddressColumn(state.data.columnDesignations); //save the new address columns index
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
                    if(row.cells[0].y === rowYCoord)
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
        appendRows(rows) {
            set(produce<ITripState>((state) => {
                const parentChildRowsToAdd = makeRowParentChildRelations(rows, state.data.addressColumnIndex)
                state.data.rows = [...state.data.rows, ...parentChildRowsToAdd]
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
                for(let i = 0; i < waypoints.length; i++)
                {
                    inSequenceRows.push(state.data.rows[waypoints[i]])
                }
                state.data.rows = inSequenceRows;
            }))
        },
        setTripDirections(tripDirections) {
            set(produce<ITripState>((state) => {
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





