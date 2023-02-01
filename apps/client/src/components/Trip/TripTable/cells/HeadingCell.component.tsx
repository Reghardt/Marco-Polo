import { numberToAlphabetical } from "../../../../Services/Trip.service";


type HeadingCellProps = {
  colNumber: number;
}

const HeadingCell: React.FC<HeadingCellProps> = ({colNumber}) =>
{

  const col = numberToAlphabetical(colNumber)

    
    return(
      <div className="mb-1">
        <button className={" w-full h-full  hover:bg-slate-100 text-base py-1"}>{col}</button>
      </div>
      
    )
}

export default HeadingCell;