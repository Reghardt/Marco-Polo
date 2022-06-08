import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


Office.onReady(() => {
  ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
  )
});



