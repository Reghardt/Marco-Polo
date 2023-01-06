import type { MouseEventHandler } from "react";

interface IStandardButtonprops{
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children?: React.ReactNode;
    color? : "BLUE" | "RED";
}

const StandardButton: React.FC<IStandardButtonprops> = ({onClick = () => {}, children, color="BLUE"}) => {

    if(color === "BLUE")
    {
        return(
            <button onClick={onClick} className="
                bg-blue-500 
                hover:bg-blue-700 
                text-white 
                font-bold 
                py-2 
                px-4 
                mr-2
                mb-2
                rounded
                focus:outline-none
                ">{children}</button>
        )
    }
    else
    {
        return(
            <button onClick={onClick} className="
                bg-red-500 
                hover:bg-red-700 
                text-white 
                font-bold 
                py-2 
                px-4 
                mr-2
                mb-2
                rounded
                focus:outline-none">{children}</button>
        )
    }


}

export default StandardButton