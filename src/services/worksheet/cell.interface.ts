export interface ICell
{
    x: number;
    y: number;
    data: string;
    origionalData: string;
    geocodedAddressRes: google.maps.GeocoderResult; 
    geocodedResults: google.maps.GeocoderResult[];
    selectedGeocodedAddressIndex: number; // default -1
}