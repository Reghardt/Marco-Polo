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

