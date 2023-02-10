import DragAndDropContext from "./DragAndDropContext";

type TGridContainerProps = {
    onDragEnd : (sequence: number[]) => void
    children?: React.ReactNode;
    tracks: string;
  }
  
const GridContainer : React.FC<TGridContainerProps> = ({onDragEnd, children, tracks}) => {


    return(
        <DragAndDropContext.Provider value={{onDragEnd}}>
        <div className='container' style={{gridTemplateColumns: tracks}} onDragEnter={(evt) => evt.preventDefault()} onDragOver={(evt) => evt.preventDefault()}>
            {children}
        </div>
        </DragAndDropContext.Provider>
    )
}

export default GridContainer