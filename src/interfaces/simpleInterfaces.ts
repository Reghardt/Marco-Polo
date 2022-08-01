//File Description: interfaces that are shared between multiple files
import { Cell } from "../classes/cell.class";

export interface IRow //each row contains a bumch of cell objects
{
    rowNumber: number;
    cells: Cell[];
}

export interface IGeocoderResult
{
    results: google.maps.GeocoderResult[];
    status: google.maps.GeocoderStatus;
}

export interface IRouteResult
{
    result: google.maps.DirectionsResult;
    status: google.maps.DirectionsStatus;
}

export interface IRouteStatistics
{
    optimized: {dist: number, time: number};
    origional: {dist: number, time: number};
}

