
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Account/Login.component'
import WorkSpaces from './Components/Account/workspaces/Workspaces.component'

import CounterExp from './Components/Experiments/Counter Experiments/CounterExperiment.component'
import Trip from './Components/Trip/Trip.component'


function App() {


  console.log("refresh app")
  

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path='/index.html' element={<Login/>}/> {/* Navigate is the new redirect. This is to handle office that searches for index.html */}
          <Route path="/login" element={<Login/>}/>
          
          <Route path="/workspaces" element={<WorkSpaces/>}/>

          <Route path="/trip" element={<Trip/>}/>


          <Route path="/exp" element={<CounterExp/>}/>
        </Routes>
      </BrowserRouter>

      {/* <Counter1/>
      <Counter2/> */}
    </div>
  )
}

export default App
