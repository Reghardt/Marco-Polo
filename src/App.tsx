
import React, { useState } from 'react';
import { loadSelection } from './services/worksheet.service';

import './App.css';

import Button from '@mui/material/Button';
import { DataTable } from './classes/dataTable.class';





function App() {
  const [dataTable, setDataTable] = useState<DataTable>(null)

  function loadWorksheetSelection()
  {
    loadSelection().then(res => {
      console.log(res)
      setDataTable(res)
    })
  }

  return (
    <div>
      {/* <VerticalLinearStepper></VerticalLinearStepper> */}
      <Button variant="contained" onClick={() => loadWorksheetSelection()} disableElevation>Press me</Button>
    </div>
  );
}

export default App;
