import { ICell } from "../../../common/CommonInterfacesAndEnums";

type DataCellProps = {
    cellRef: ICell;
}

const DataCell: React.FC<DataCellProps> = ({cellRef}) =>
{

    return(
            <div draggable="true">
                <button 
                className={"w-full h-full pointer-events-none bg-slate-200 text-base p-1 text-left"}
                style={{minHeight: "25px"}}
                  //sx={{width: "100%", height: "100%", textTransform: "none", borderRadius: 0, justifyContent: "flex-start", minHeight: "2.4em", pointerEvents: "none"}}
                  >
                    {cellRef.displayData}
                </button>
                
            </div>
        )
}

export default DataCell;