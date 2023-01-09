import { createContext } from "react";

interface IDragAndDropContextInterface{
    onDragEnd : (sequence: number[]) => void
}

const DragAndDropContext = createContext<IDragAndDropContextInterface>({
    onDragEnd: () => {}
})

export default DragAndDropContext