import { IRow } from "../../../interfaces/simpleInterfaces";
import { IHeading } from "./Heading.interface";

export interface ITableData{
    headings: IHeading[];
    rows: IRow[];
}