//File Description: interfaces that are shared between multiple files

import { ICell } from "../services/worksheet/cell.interface";

export interface IGeocoderResult
{
    results: google.maps.GeocoderResult[];
    status: google.maps.GeocoderStatus;
}

export interface ITripDirections
{
    result: google.maps.DirectionsResult;
    status: google.maps.DirectionsStatus;
}



export interface ICellAndRange
{
    cell: ICell;
    range: Excel.Range
}

export interface IMember{
    _id: string;
    userId: string;
    role: string
    lastUsedVehicleId: string;
    lastUsedFuelPrice: number;
}

export interface IVehicleListEntry{
    _id: string;
    vehicleDescription: string;
    vehicleLicencePlate: string;
    litersPer100km: number;
    additionalCost: number;
    additionalCostType: number; // 1 = R/hr, 2 = R/100km
    vehicleClass: string;
}
