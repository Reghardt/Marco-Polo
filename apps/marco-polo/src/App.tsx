
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Account/Login.component'
import WorkSpaces from './Components/Account/workspaces/Workspaces.component'

import Trip from './Components/Trip/Trip.component'
import './App.css'
import AdminPanel from './Components/AdminPanel/AdminPanel.component'

function App() {


  console.log("refresh app")
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path='/index.html' element={<Login/>}/> {/* Navigate is the new redirect. This is to handle office that searches for index.html */}
          <Route path="/login" element={<Login/>}/>
          
          <Route path="/workspaces" element={<WorkSpaces/>}/>

          <Route path="/trip" element={<Trip/>}/>

          <Route path="/admin" element={<AdminPanel/>}/>
        </Routes>
      </BrowserRouter>

      {/* <Counter1/>
      <Counter2/> */}
    </>
  )
}

export default App
