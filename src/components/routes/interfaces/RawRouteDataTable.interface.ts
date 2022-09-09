import { IRow } from "../../../services/worksheet/row.interface";
import { IHeading } from "./Heading.interface";

export interface IRawRouteTableData{
    firstRowIsHeading: boolean;
    headings: IRow;
    rows: IRow[];
}