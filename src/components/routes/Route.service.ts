import { IGeocoderResult } from "../../interfaces/simpleInterfaces";
import { ICell } from "../../services/worksheet/cell.interface";
import { IRow } from "../../services/worksheet/row.interface";

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



