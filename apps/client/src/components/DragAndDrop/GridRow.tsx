import { useContext } from "react";
import DragAndDropContext from "./DragAndDropContext";

type TGridRow = {
    children?: React.ReactNode;
    draggableId: number;
  }

const GridRow: React.FC<TGridRow> = ({children, draggableId}) => {

    const listSetter = useContext(DragAndDropContext).onDragEnd

    function getElementWithClassFromCollection(className: string, collection: HTMLCollection | undefined)
    {
        if(collection)
        {
            for(let i = 0; i < collection.length; i++)
            {
                if(collection[i].classList.contains(className)) 
                {
                    return collection[i]
                }
            }
            return null
        }
        return null
    }

    function applyStyleToElementAndImmediateChildren(element: HTMLDivElement, style: string)
    {
        element.classList.add(style)
        for(let i = 0; i < element.children.length; i++)
        {
            element.children.item(i)?.classList.add(style)
        }
    }

    function removeStyleToElementAndImmediateChildren(element: HTMLDivElement, style: string)
    {
        element.classList.remove(style)
        for(let i = 0; i < element.children.length; i++)
        {
            element.children.item(i)?.classList.remove(style)
        }
    }

    return(
        <div draggable="true" className='row' draggable-id={draggableId}
            onDragStart={(evt) => {
                evt.dataTransfer.effectAllowed = "move"
                applyStyleToElementAndImmediateChildren(evt.currentTarget, "dragSrcElem")
            }}

            onDragEnd={(evt) => {
                removeStyleToElementAndImmediateChildren(evt.currentTarget, "dragSrcElem")
                console.log(evt)
            }}
            onDragOver={(evt) => {evt.preventDefault()}} //continues to fire on hover

            onDragEnter={(evt) => {
            
                const dragSrcElem = getElementWithClassFromCollection("dragSrcElem", evt.currentTarget.parentElement?.children)
                
                //if this is not the drag elem and the dragSrcElem exists
                if(!evt.currentTarget.classList.contains("dragSrcElem") && dragSrcElem)
                {
                    const dragSrcElemFirstChild =  dragSrcElem.children.item(0)
                    const dropTargetTopFirstChild =  evt.currentTarget.children.item(0)

                    if(dragSrcElemFirstChild && dropTargetTopFirstChild)
                    {
                        const dragRefTop = dragSrcElemFirstChild.getBoundingClientRect().top
                        const dropTargetTop = dropTargetTopFirstChild.getBoundingClientRect().top

                        if(dragRefTop < dropTargetTop)
                        {
                            evt.currentTarget.parentElement?.insertBefore(evt.currentTarget, dragSrcElem)
                        }
                        else
                        {
                            evt.currentTarget.parentElement?.insertBefore(dragSrcElem, evt.currentTarget)
                        }
                    }
                }
                // evt.preventDefault()
            }}

            onDrop={(evt) => {
                evt.stopPropagation()
                console.log(evt)
                const sequence: number[] = []
                const rows = evt.currentTarget.parentElement?.children
                if(rows)
                {
                    for(let i = 0; i < rows.length; i++)
                    {
                        const val = rows.item(i)?.attributes.getNamedItem("draggable-id")?.value
                        if(val)
                        {
                            sequence.push(parseInt(val))
                        }
                    }
                    // console.log(sequence)
                }

                listSetter(sequence)
            }}
        >
            {children}
        </div>
    )
}

export default GridRow