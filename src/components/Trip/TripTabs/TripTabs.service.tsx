import React from "react";

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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