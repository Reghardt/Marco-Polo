import { IGeocoderResult } from "../../interfaces/simpleInterfaces";
import { ICell } from "../../services/worksheet/cell.interface";

export function geocodeAddress(address: string) : Promise<IGeocoderResult>
    {
      let geoResPromise = new Promise<IGeocoderResult>((resolve) => {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: address, region: "ZA"},(res, status) => {
          resolve({status, results: res})
        })
      })

      return geoResPromise;
    }

export function createBasicHeadingCell(x: number, name: string)
{
  let cell: ICell = {x: x, y: -1, data: name, origionalData: name, geocodedAddressRes: null, geocodedResults: [], selectedGeocodedAddressIndex: null}
  return cell
}