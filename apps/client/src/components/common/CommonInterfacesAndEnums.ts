export interface ICell
{
    x: number;
    y: number;
    displayData: string;
    editableData: string;
    //geocodedResults: google.maps.GeocoderResult[];
    geocodedDataAndStatus: IGeoStatusAndRes | null;
    selectedGeocodedAddressIndex: number;
    formula: string; // default ""
    isGeoResAccepted: boolean;
}

export interface IRow //each row contains a bumch of cell objects
{
    //rowNumber: number;
    //rowId: number;
    cells: ICell[];
    children: IRow[];
}

export interface ICellAndRange
{
    cell: ICell;
    range: Excel.Range
}

export enum EColumnDesignations{
    Data = 0,
    Address = 1
}

export interface IGeoStatusAndRes
{
    results: google.maps.GeocoderResult[] | null;
    status: google.maps.GeocoderStatus;
}



export interface ITripDirections
{
    result: google.maps.DirectionsResult | null;
    status: google.maps.DirectionsStatus;
}

// export interface IVehicleListEntry{
//     _id: string;
//     vehicleDescription: string;
//     vehicleLicencePlate: string;
//     litersPer100km: number;
//     additionalCost: number;
//     additionalCostType: number; // 1 = R/hr, 2 = R/100km
//     vehicleClass: string;
// }

export enum EAdditionalCostType{
    R_hr = 1,
    R_100km = 2
}

export enum EVehicleClass{
    class1 = "Class 1",
    class2 = "Class 2",
    class3 = "Class 3",
    class4 = "Class 4"
}

export interface IAddressBookEntry{
    _id: string;
    physicalAddress: string;
    addressDescription: string;
}

export interface IWorkspace{
    _id: string;
    workspaceName: string;
    descriptionPurpose: string;
    tokens: number;
}


export interface ILeg {
    givenAddress: string; //rename to displayName
    fullAddressStr: string;
    legDetails: {name: string, value: string}[];
    avoidTolls: boolean;
    legStatus: number;
}

