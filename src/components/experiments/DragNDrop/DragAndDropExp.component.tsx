import { grid, padding } from "@mui/system";
import React, { useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface IItem{
    id: string;
    content: string;
}

function getItems(count: number)
{
    let items: IItem[] = []
    for(let i = 0; i < count; i++)
    {   
        items.push({
            id: `item-${i}`,
            content: `item ${i}`
        })
    }
    return items;
}

function reorder(list: IItem[], startIndex: number, endIndex: number )
{
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
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

function getListStyle(isDraggingOver: boolean)
{
    return{
        background: isDraggingOver ? "lightblue": "lightgrey",
        padding: grid,
        width: 250
    }
}

const DragAndDrop: React.FC = () => {

    const [items, setItems] = useState(getItems(10))

    function onDragEnd(result)
    {
        if(!result.destination)
        {
            return;
        }

        const newItems = reorder(items, result.source.index, result.destination.index)
        setItems(newItems)
    }

    return(
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef} 
                            style={{background: snapshot.isDraggingOver ? "lightblue": "lightgrey", padding: 16, width: 250}}
                        >
                            {items.map((item, index) => {
                                return <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.draggableProps} 
                                            {...provided.dragHandleProps} 
                                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                        >
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default DragAndDrop