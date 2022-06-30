import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login.component';


Office.onReady(() => {
  ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/index.html" element={<App/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
  )
});



