import { IRow } from "../../../services/worksheet/row.interface";
import { IHeading } from "./Heading.interface";

export interface IRawRouteTableData{
    headings: IHeading[];
    rows: IRow[];
}