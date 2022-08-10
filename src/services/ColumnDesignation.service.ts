export enum EColumnDesignations{
    Data = 0,
    Address = 1
}

export function handleSetColumnAsData(colIdx: number, columnDesignations: number[]) : number[]
{
    const tempColumnDesignations = columnDesignations.slice()
    tempColumnDesignations[colIdx] = EColumnDesignations.Data;
    return tempColumnDesignations
}

export function handleSetColumnAsAddress(colIdx: number, columnDesignations: number[]) : number[]
{
    const tempColumnDesignations = columnDesignations.slice()
    for(let i = 0; i < tempColumnDesignations.length; i++)
    {
        if(tempColumnDesignations[i] === EColumnDesignations.Address)
        {
            tempColumnDesignations[i] = EColumnDesignations.Data
        }
    }
    tempColumnDesignations[colIdx] = EColumnDesignations.Address;
    return tempColumnDesignations
}


