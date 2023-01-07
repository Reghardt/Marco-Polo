import React from "react"
import { Draggable } from "react-beautiful-dnd"

interface IDraggerProps{
    draggableId: string;
    index: number;
    children?: React.ReactNode
}


function getItemStyle(isDragging: boolean, draggableStyle: any): React.CSSProperties
{
    return{
        userSelect: "none",
        //padding: grid * 2,
        marginBottom: "0.5em",

        background: isDragging ? "lightgreen" : "transparent",
        ...draggableStyle
    }
}

const Dragger: React.FC<IDraggerProps> = ({draggableId, index, children}) => {
    return(
        <Draggable draggableId={draggableId} index={index}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    style={{...getItemStyle(snapshot.isDragging, provided.draggableProps.style), padding: 0, marginBottom: "0.2em"}}
                >
                    {children}
                </div>
            )}
        </Draggable>
    )
}

export default Dragger