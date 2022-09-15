

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';


import RouteTypeSelection from './components/workspaces/RouteTypeSelection.component';
import RouteBuilder from './components/routes/RouteBuilder/RouteBuilder.component';
import CreateAccount from './components/user/CreateAccount.component';
import Login from './components/user/Login.component';
import CreateWorkspace from './components/workspaces/CreateWorkspace.component';
import WorkSpaces from './components/workspaces/Workspaces.component';
import Success from './components/payment/Success';
import PopperExperiment from './components/experiments/PopperExperiment.component';
import AdminPanel from './components/admin/AdminPanel.component';



function App() {

  return (
    <div style={{height: '100%', textTransform: "none"}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path='index.html' element={<Navigate to="/"/>}/> {/* Navigate is the new redirect. This is to handle office that searches for index.html */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<CreateAccount/>}/>
          <Route path="/workspaces" element={<WorkSpaces/>}/>
          <Route path="/createWorkspace" element={<CreateWorkspace/>}/>
          <Route path="/routeMenu" element={<RouteTypeSelection/>}/>
          <Route path="/jobEditor" element={<RouteBuilder/>}/>
          <Route path="/success" element={<Success/>}/>
          <Route path="/exp" element={<PopperExperiment/>}/>
          <Route path="/admin" element={<AdminPanel/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
