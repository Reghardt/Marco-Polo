import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { msalConfig } from './utils/msalConfig'
import TrpcWrapper from './utils/Trpc.wrapper'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

Office.onReady((res) =>{
  console.log(res)
  if(res.host === Office.HostType.Excel && ( res.platform !== Office.PlatformType.OfficeOnline || res.platform !== Office.PlatformType.PC))
  {

    const msalInstance = new PublicClientApplication(msalConfig);
    root.render(
      <React.StrictMode>
        <TrpcWrapper>
          <MsalProvider instance={msalInstance}>
            <App/>
          </MsalProvider>
        </TrpcWrapper>
      </React.StrictMode>,
    )
  }
  else
  {
    root.render(
      <div>
        Error: Loaded outside Excel Environment
      </div>
    )
  }
})


