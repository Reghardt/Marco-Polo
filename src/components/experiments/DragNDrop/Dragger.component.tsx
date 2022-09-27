import React from "react"
import { Draggable } from "react-beautiful-dnd"

interface IDraggerProps{
    draggableId: string;
    index: number;
}


function getItemStyle(isDragging: boolean, draggableStyle)
{
    const grid = 8
    return{
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        background: isDragging ? "lightgreen" : "grey",
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
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                >
                    {children}
                </div>
            )}
        </Draggable>
    )
}

export default Dragger