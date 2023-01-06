export interface IGeoStatusAndRes
{
    results: google.maps.GeocoderResult[] | null;
    status: google.maps.GeocoderStatus;
}

export interface ICell
{
    x: number;
    y: number;
    displayData: string;
    editableData: string;
    //geocodedResults: google.maps.GeocoderResult[];
    geoStatusAndRes: IGeoStatusAndRes | null;
    selectedGeocodedAddressIndex: number;
    formula: string; // default ""
    geoResConfirmed: boolean;
}

export interface ICellAndRange
{
    cell: ICell;
    range: Excel.Range
}

export interface IRow //each row contains a bumch of cell objects
{
    //rowNumber: number;
    //rowId: number;
    cells: ICell[];
    children: IRow[];
}

export interface ITripDirections
{
    result: google.maps.DirectionsResult | null;
    status: google.maps.DirectionsStatus;
}

export interface IVehicleListEntry{
    _id: string;
    vehicleDescription: string;
    vehicleLicencePlate: string;
    litersPer100km: number;
    additionalCost: number;
    additionalCostType: number; // 1 = R/hr, 2 = R/100km
    vehicleClass: string;
}