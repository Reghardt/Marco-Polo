import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';
import { MsalProvider } from '@azure/msal-react';



const msalInstance = new PublicClientApplication(msalConfig);

Office.onReady(() => {
  ReactDOM.render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </MsalProvider>
        

      
      
    </React.StrictMode>,
    document.getElementById("root")
    )
});



