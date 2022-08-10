export interface ICell
{
    x: number;
    y: number;
    data: string;
    origionalData: string;
    geocodedAddressRes: google.maps.GeocoderResult; 
}