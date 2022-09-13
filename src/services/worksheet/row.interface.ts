import { ICell } from "./cell.interface";

export interface IRow //each row contains a bumch of cell objects
{
    //rowNumber: number;
    cells: ICell[];
    children: IRow[];
}