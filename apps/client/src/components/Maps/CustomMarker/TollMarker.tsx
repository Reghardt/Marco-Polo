import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import { useRef, useState } from "react";
import { IToll } from "../Tolls"

interface ITollMarker{
    tollInfo: IToll,
}

const TollMarker: React.FC<ITollMarker> = ({tollInfo}) => {

    const selfRef = useRef<HTMLDivElement>(null)

    const [open, setOpen] = useState(false);

    function handleSetOpen(newState: boolean)
    {
        setOpen(() => {
            if(newState) //open
            {
                setZIndex(100)
                return true
            }
            else //close
            {
                setZIndex(1)
                return false
            }
        });
    }

    const {x, y, reference, floating, strategy, context} = useFloating({
      middleware: [
        shift(), 
        flip(),
        offset(-4),
  
      ],
      whileElementsMounted: autoUpdate,
      placement: "top",
      open,
      onOpenChange: handleSetOpen,
  
    });
  
    const dismiss = useDismiss(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([
      dismiss,
    ]);

    //changes z index of the anchor parent that is displayed on the map. The parent's z index is then chaged relative to the other marker's z indces
    function setZIndex(zIndex: number)
    {
        if(selfRef.current?.parentElement?.parentElement)
        {
            selfRef.current.parentElement.parentElement.style.zIndex = zIndex.toString()
        }
    }

    return(
        <div ref={selfRef}>

            <button onClick={
                ()=> {
                    handleSetOpen(!open)
                }} 
                {...getReferenceProps()} ref={reference} className={"w-6 h-6 rounded-full bg-red-600 text-white"}>
                <div>T</div>
            </button>

            {open && (
                <div 
                    className={"bg-white shadow-xl p-2 grid"}
                    ref={floating}
                    style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    width: 'auto',
                    gridTemplateColumns: "max-content 1fr",
                    columnGap: "4px"
                    }}
                    {...getFloatingProps()}
                >
                    <div className={"text-sm"}>{tollInfo.name}</div> 
                    <div></div>

                    <div className={"flex items-center"}>Class 1: R</div>
                    <div className={"text-sm flex justify-end"}>{tollInfo.tarrif.class1.toPrecision(4)}</div>

                    <div className={"flex items-center"}>Class 2: R  </div>
                    <div className={"text-sm flex justify-end"}>{tollInfo.tarrif.class2.toFixed(2)}</div>

                    <div className={"flex items-center"}>Class 3: R  </div>
                    <div className={"text-sm flex justify-end"}>{tollInfo.tarrif.class3.toFixed(2)}</div>

                    <div className={"flex items-center"}>Class 4: R  </div>
                    <div className={"text-sm flex justify-end"}>{tollInfo.tarrif.class4.toFixed(2)}</div>
                    
                </div>
            )}
        </div>

    )
}

export default TollMarker