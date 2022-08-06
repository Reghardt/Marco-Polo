//File Description: interfaces that are shared between multiple files

import { ICell } from "../services/worksheet/cell.interface";

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

export interface ICellAndRange
{
    cell: ICell;
    range: Excel.Range
}

