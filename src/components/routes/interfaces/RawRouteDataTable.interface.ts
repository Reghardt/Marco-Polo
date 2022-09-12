import { IRow } from "../../../services/worksheet/row.interface";

export interface IRawRouteTableData{
    columnDesignations: number[];
    firstRowIsHeading: boolean;
    headings: IRow;
    rows: IRow[];
}