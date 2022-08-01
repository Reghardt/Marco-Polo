import { IRow } from "../../../services/worksheet/row.interface";
import { IHeading } from "./Heading.interface";

export interface ITableData{
    headings: IHeading[];
    rows: IRow[];
}