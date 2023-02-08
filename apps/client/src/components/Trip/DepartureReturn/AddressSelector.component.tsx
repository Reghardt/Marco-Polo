import React, { useState } from "react";
import { IAddress } from "../../common/CommonInterfacesAndEnums";
import GAutoComplete from "../../Experiments/GAutoComplete.component";
import { Button, Dialog } from "@mui/material";
import AddressBookDialog from "./AddressBookDialog.component";
import { getFirstPlacePrediction } from "../../../Services/Trip.service";

interface IAddressSelectorProps{
    address: IAddress | null;
    //addressSetter: React.Dispatch<React.SetStateAction<google.maps.GeocoderResult>>;
    addressSetter: (departureAddress: IAddress) => void
    title: string;

}

const AddressSelector: React.FC<IAddressSelectorProps> = ({address, addressSetter, title}) =>
{

  const [isModalOpen, setIsModalOpen] = useState(false)

  async function applyAddressBookSelection(address: string)
  {
    console.log("address book selection fired", address)
    
    addressSetter(await getFirstPlacePrediction(address))
    setIsModalOpen(!isModalOpen);
  }

  return(
    <div>
      <div className={"pt-2 mb-4 bg-slate-50 rounded-md"}>
        <div className={"space-y-4"}>
          <div className={" text-base text-[#1976d2]"}>{title}:</div>

          <div>
            <GAutoComplete setAddress={addressSetter} currentAddress={address?.formatted_address ?? ""}/>
          </div>

          <div className="">
            <Button variant="contained" onClick={() => setIsModalOpen(!isModalOpen)}>Address Book</Button>
          </div>

        </div>
      </div>

      <Dialog
          PaperProps={{sx: {width: "80%", minHeight: "90%"}}}
          open={isModalOpen}
          scroll={"body"}
          //onClose={}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <AddressBookDialog setIsModalOpen={setIsModalOpen} applyAddressBookSelection={applyAddressBookSelection}/>
      </Dialog>


      {/* {open && (
              <div 
                ref={floating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  width: 'max-content',
                  zIndex: 1
                }}
                {...getFloatingProps()}
              >
                <DepartureReturnPopup title={title} address={address} addressSetter={addressSetter} toggleShow={toggleShow}/>
              </div>
        )} */}
    </div>
  )
}

export default AddressSelector;