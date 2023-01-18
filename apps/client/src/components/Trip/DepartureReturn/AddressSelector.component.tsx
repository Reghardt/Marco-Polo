import React, { useState } from "react";
import AddressSelectorPopup from "./AddressSelectorPopup.component";
import { useFloating, shift, offset, useDismiss, useInteractions, autoUpdate } from "@floating-ui/react";

interface IAddressSelectorProps{
    address: google.maps.GeocoderResult | null;
    //addressSetter: React.Dispatch<React.SetStateAction<google.maps.GeocoderResult>>;
    addressSetter: (address: google.maps.GeocoderResult) => void
    title: string;

}

const AddressSelector: React.FC<IAddressSelectorProps> = ({address, addressSetter, title}) =>
{
  const [open, setOpen] = useState(false);

  const {x, y, reference, floating, strategy, context} = useFloating({
    middleware: [
      shift(), 
      offset(-4),

    ],
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
    open,
    onOpenChange: setOpen,

  });

  const dismiss = useDismiss(context);
  const {getReferenceProps, getFloatingProps} = useInteractions([
    dismiss,
  ]);


  function toggleShow()
  {
    setOpen(current => {
      return !current;
    })
  }

  return(
    <React.Fragment>

      <div>
        <button {...getReferenceProps()} ref={reference} onClick={()=> setOpen(!open)} className={"p-3 mb-2 text-left bg-slate-50 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"}>
          <div className={"space-y-2"}>
            <div className={" text-sm"}>{title}:</div>
            {
              address?.formatted_address 
              ? <div className={"text-[#1976d2]"}>{address?.formatted_address}</div>
              : <div className={" drop-shadow text-red-600"}>{"click to select address"}</div>
            }
            
          </div>
        </button>
      </div>


      {open && (
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
                {/* <div ref={setArrowRef} style={styles.arrow} className="arrow"/> */}
                <AddressSelectorPopup title={title} address={address} addressSetter={addressSetter} toggleShow={toggleShow}/>
              </div>
        )}
    </React.Fragment>
  )
}

export default AddressSelector;