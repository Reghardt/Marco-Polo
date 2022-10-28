import { AuthenticationResult, SilentRequest } from "@azure/msal-browser";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import jwtDecode from "jwt-decode";
import React from "react"

import { loginRequest } from "../../../msalConfig";



const SignOnExperiment: React.FC = () => {

    const { instance, accounts } = useMsal();

    async function msLoginUser()
    {

    }

    async function ssoLogin()
    {
        try
        {
            let userTokenEncoded = await Office.auth.getAccessToken({allowSignInPrompt: true});
            //console.log(userTokenEncoded)
            let decoded = jwtDecode(userTokenEncoded)
            console.log(decoded)
            
            console.log((decoded as any).name)
            console.log((decoded as any).preferred_username)
            console.log((decoded as any).oid)
            //requestProfileData()
        }
        catch(err)
        {
            if (err.code === 13003) {
                console.log("SSO is not supported for domain user accounts, only Microsoft 365 Education or work account, or a Microsoft account.")
                
            } else {
                console.log(err)
            }
        }
    }

    function requestProfileData()
    {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then(tokenSilent => {
            console.log(tokenSilent.idToken)
            // callMsGraph(tokenSilent.accessToken).then(res => {
            //     console.log(res)
            // })
        })
    }

    function handlePopupLogout()
    {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
    }

    function loginStandalone()
    {
        console.log("dialog fired - Excel")
        let dialog: Office.Dialog;
        Office.context.ui.displayDialogAsync( 
            window.location.protocol + '//' + window.location.host + '/api/auth/ms', 
            {height: 50, width: 30 },
            (result) => {
                console.log(result)
                dialog = result.value
                if (result.status === Office.AsyncResultStatus.Failed) {
                    //TODO display error here
                    //displayError(`${result.error.code} ${result.error.message}`);
                }
                else 
                {
                    dialog.addEventHandler(Office.EventType.DialogMessageReceived, (args) => {
                        console.log(args)
                        if((args as any).error)
                        {
                            console.error("error occured")
                            dialog.close()
                        }
                        else
                        {
                            let parsedArgs = JSON.parse((args as any).message)

                            let accessToken: AuthenticationResult = parsedArgs.result
                            console.log(accessToken)
                            dialog.close() 
                        }
                    })
                }
            })
    }
    

    function loginExcelOnline()
    {
        console.log("Popup fired - Online")
        instance.loginPopup(loginRequest).then(res => {
            console.log(res)
        }).catch(e => {console.log(e)})
    }

    function login()
    {
        if(window.top === window){ // the add-in is not running in Excel Online
            
            loginStandalone()
        }
        else //is running in excel online
        {
            loginExcelOnline()
        }
    }

    return(
        <div>
            <h1>test</h1>
            <button onClick={() => {ssoLogin()}}>SSO sign in</button>
            <button onClick={() => login()}>Sign In</button>

            <AuthenticatedTemplate>
                <p>Signed in</p>
                <button onClick={() => {requestProfileData()}}>Request data</button>
                <button onClick={() => {handlePopupLogout()}}>logout</button>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <p>not signed in</p>
            </UnauthenticatedTemplate>
        </div>
    )
}

export default SignOnExperiment