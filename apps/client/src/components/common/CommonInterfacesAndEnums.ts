export interface ICell
{
    x: number;
    y: number;
    displayData: string;

    geocodedDataAndStatus: IGeoStatusAndRes | null; // TODO remove null option
    selectedGeocodedAddressIndex: number;
    formula: string; // default ""
    isAddressAccepted: boolean;
}

export interface IRow //each row contains a bumch of cell objects
{
    cells: ICell[];
    children: IRow[];
    paths: google.maps.LatLng[][]; //save the polylines for the row. They can later be used to see if a path intersects a toll gate
}

export interface ICellAndRange
{
    cell: ICell;
    range: Excel.Range
}

export enum EColumnDesignations{
    Data = 1,
    Address = 2,
    LinkAddress = 3
}

export interface IGeoStatusAndRes
{
    status: google.maps.GeocoderStatus;
    results: google.maps.GeocoderResult[] | null;
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

