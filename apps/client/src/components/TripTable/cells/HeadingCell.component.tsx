import React from "react";
import Button from "../../ui/Button";


type HeadingCellProps = {
  colNumber: number;
}

const HeadingCell: React.FC<HeadingCellProps> = ({colNumber}) =>
{
  const col = String.fromCharCode(colNumber - 1 + 'A'.charCodeAt(0))

    return(
      <div className="mb-2 bg-sky-500 text-center border-2 border-indigo-600">{col}</div>
    )
}

export default HeadingCell;