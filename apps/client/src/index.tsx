import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './utils/msalConfig';
import TrpcWrapper from './utils/Trpc.wrapper';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

Office.onReady((res) => {
  console.log(res)
  if(res.host === Office.HostType.Excel && ( res.platform !== Office.PlatformType.OfficeOnline || res.platform !== Office.PlatformType.PC))
  {

    const msalInstance = new PublicClientApplication(msalConfig);

    
    root.render(
      // <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <TrpcWrapper>
            <App />
          </TrpcWrapper>
        </MsalProvider>
      //</React.StrictMode>
    );
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
