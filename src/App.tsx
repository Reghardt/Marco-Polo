

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import RouteMenu from './components/routes/RouteMenu.component';
import RouteEditor from './components/routes/RouteEditor.component';
import CreateAccount from './components/user/CreateAccount.component';
import Login from './components/user/Login.component';
import CreateWorkspace from './components/workspaces/CreateWorkspace.component';
import WorkSpaces from './components/workspaces/Workspaces.component';



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path='index.html' element={<Navigate to="/"/>}/> {/* Navigate is the new redirect. This is to handle office that searches for index.html */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<CreateAccount/>}/>
          <Route path="/workspaces" element={<WorkSpaces/>}/>
          <Route path="/createWorkspace" element={<CreateWorkspace/>}/>
          <Route path="/routeMenu" element={<RouteMenu/>}/>
          <Route path="/jobEditor" element={<RouteEditor/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
