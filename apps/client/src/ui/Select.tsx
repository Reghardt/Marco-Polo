import { useFloating, flip, shift, offset, autoUpdate, useDismiss, useInteractions, size } from "@floating-ui/react";
import { useState } from "react";

type TSelectProps = {
    elements: {value: number, content: React.ReactNode}[];
    onChange: (e: number) => void;
    value: number;
}

const Select: React.FC<TSelectProps> = ({elements, onChange, value}) => {

    // const [selectedPerson, setSelectedPerson] = useState(people[0])
    const [open, setOpen] = useState(false)
    
  
    const {x, y, reference, floating, strategy, context} = useFloating({
      middleware: [
        shift(), 
        offset(-4),
        size({
          apply({rects, elements}){
            Object.assign(elements.floating.style, {minWidth: `${rects.reference.width}px`})
          }
        })
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

    return (
      <>
        <button {...getReferenceProps()} ref={reference}  onClick={() => setOpen(!open)} className="  text-clip w-full cursor-default rounded-lg bg-white py-2 pl-0 pr-0 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className='block truncate px-4'>{elements[value].content}</span>
        </button>
        {open && (
                <div
                {...getFloatingProps()}
                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-opacity-5 focus:outline-none sm:text-sm"
                ref={floating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  width: 'max-content',
                }}
              >
                {/* {elements.map((elem, idx) => {
                    return <div key={idx}>{elem.content}</div>
                })} */}
  
                {elements.map((elem, idx) => (
                  <div key={idx}>
                    <button
                    onClick={() => {onChange(elem.value); setOpen(!open)}}
                    className={`relative cursor-default select-none py-2 pl-10 pr-4 ${elem.value === value ? 'bg-amber-100 text-amber-900' : 'text-gray-900'}`}
                    >
                      <>
                        <span className={`block truncate font-normal ${elem.value === value  ? 'font-medium' : 'font-normal'}`}>
                          {elem.content}
                        </span>
                      </>
                    </button>
                  </div>
                  
                ))}
  
              </div>
        )}
  
      </>
      
    )
  }

  export default Select