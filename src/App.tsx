
import React from 'react';
import { getSelectedRanges } from './services/worksheet.service';

import './App.css';

import Button from '@mui/material/Button';




function App() {
  return (
    <div>
      {/* <VerticalLinearStepper></VerticalLinearStepper> */}
      <Button variant="contained" onClick={() => getSelectedRanges()} disableElevation>Press me</Button>
    </div>
  );
}

export default App;
