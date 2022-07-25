import { Row } from "../../interfaces/simpleInterfaces";
import { Heading } from "./Heading.interface";

export interface TableData{
    headings: Heading[];
    rows: Row[];
}