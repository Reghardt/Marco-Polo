import React from "react"
import { Droppable } from "react-beautiful-dnd"

interface IDropperProps{
    droppableId: string;
}

const Dropper: React.FC<IDropperProps> = ({droppableId, children}) => {
    return(
        <Droppable droppableId={droppableId}>
            {(provided, snapshot) => (
                <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    style={{background: snapshot.isDraggingOver ? "lightblue": "lightgrey", padding: 16, width: 250}}
                >
                    {children}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default Dropper