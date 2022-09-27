import { grid } from "@mui/system";
import React, { useState } from "react"
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import Dragger from "./Dragger.component";
import Dropper from "./Dropper.component";

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

const DragAndDrop: React.FC = () => {

    const [items, setItems] = useState(getItems(10))

    function onDragEnd(result: DropResult)
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
                <Dropper droppableId="droppable">
                    {items.map((item, index) => {
                        return <Dragger key={item.id} draggableId={item.id} index={index} >
                            {item.content}
                        </Dragger>
                    })}
                </Dropper>
            </DragDropContext>
        </div>
    )
}

export default DragAndDrop