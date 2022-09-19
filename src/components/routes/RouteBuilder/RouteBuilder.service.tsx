import React from "react";
import { IRow } from "../../../services/worksheet/row.interface";

interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

export function removeRowParentChildRelations(rows: IRow[])
{
    console.log("reset parent- children")
    let noRelationRows: IRow[] = [];
    for(let i = 0; i < rows.length; i++)
    {
        noRelationRows.push(rows[i])
        let children = rows[i].children
        
        for(let j = 0; j < children.length; j++)
        {
        noRelationRows.push(children[j])
        }
        rows[i].children = []
    }
    return noRelationRows
}

export function makeRowParentChildRelations(rows: IRow[], addressColumnIndex: number)
{
    console.log("make parent- children")
    console.log(rows, addressColumnIndex)
    let parentWithChildrenRows: IRow[] = [];
    for(let i = 0; i < rows.length; i++)
    {
        if(rows[i].cells[addressColumnIndex].data !== "")
        {
        parentWithChildrenRows.push(rows[i])
        }
        else
        {
            if(parentWithChildrenRows.length > 0 && parentWithChildrenRows[parentWithChildrenRows.length - 1].cells[addressColumnIndex].data !== "")
            {
                let lastParent = parentWithChildrenRows[parentWithChildrenRows.length - 1]
                lastParent.children.push(rows[i])
            }
            else
            {
                parentWithChildrenRows.push(rows[i])
            }
        }
    }
    return parentWithChildrenRows
}

export function TabPanel(props: ITabPanelProps): JSX.Element
{
    const { children, value, index, ...other } = props;
  
    return (
      <div
        hidden={!(value === index)}
        id={`simple-tabpanel-${index}`} //TODO give everything in the app a unique id based on this approach, not just a number
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
            {children}
      </div>
    );
  }

  //not sure what this function does but include it as a SO answer said it has something to do with the compiler
export function tabProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }