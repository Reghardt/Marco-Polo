export interface ICell
{
    x: number;
    y: number;
    data: string;
    origionalData: string;
    geocodedAddressRes: google.maps.GeocoderResult | null; 
    geocodedResults: google.maps.GeocoderResult[];
    selectedGeocodedAddressIndex: number | null;
    formula: string; // default ""
}