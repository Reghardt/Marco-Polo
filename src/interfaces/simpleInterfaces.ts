//File Description: interfaces that are shared between multiple files
import { Cell } from "../classes/cell.class";

export interface Row //each row contains a bumch of cell objects
{
    rowNumber: number;
    cells: Cell[];
}

export interface GeocoderResult
{
    results: google.maps.GeocoderResult[];
    status: google.maps.GeocoderStatus;
}

