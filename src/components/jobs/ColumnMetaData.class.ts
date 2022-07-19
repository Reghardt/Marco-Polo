export class ColumnMetaData
{
    colName: string;
    isAddress: boolean;

    constructor(colName: string)
    {
        this.colName = colName
        this.isAddress = false;
    }
}