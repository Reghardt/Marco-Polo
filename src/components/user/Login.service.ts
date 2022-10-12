import { AuthenticationResult, IPublicClientApplication } from "@azure/msal-browser";
import { loginRequest } from "../../msalConfig";

export async function ssoLogin()
    {
        console.log("sso")
        try
        {
            let userTokenEncoded = await Office.auth.getAccessToken({allowSignInPrompt: false, allowConsentPrompt: true, forMSGraphAccess: true});
            console.log(userTokenEncoded)

            
            return userTokenEncoded

        }
        catch(err)
        {
            if (err.code === 13003) {
                console.log("SSO is not supported for domain user accounts, only Microsoft 365 Education or work account, or a Microsoft account.")
                return ""
                
            } else {
                console.log(err)
                return ""
            }
        }
    }

    function handlePopupLogout(instance: IPublicClientApplication)
    {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
    }

    function openOfficeDialog()
    {
        return new Promise<{dialog: Office.Dialog, status: Office.AsyncResultStatus}>((accept) => {
            Office.context.ui.displayDialogAsync( 
                window.location.protocol + '//' + window.location.host + '/api/auth/msLoginPopup', 
                {height: 50, width: 30 }, (dialogResult) => {accept({dialog: dialogResult.value, status: dialogResult.status})})
        })
        
    }

    //uses MSAL for login in the standalone desktop app
    async function loginStandalone()
    {
        console.log("dialog fired - Excel")
        let {dialog, status} = await openOfficeDialog()
        return new Promise<string>((accept, reject) => {
            if (status === Office.AsyncResultStatus.Failed) {
                //TODO display error here
                //displayError(`${result.error.code} ${result.error.message}`);
                reject(status)
            }
            else 
            {
                dialog.addEventHandler(Office.EventType.DialogMessageReceived, (args) => {
                    console.log(args)
                    if((args as any).error)
                    {
                        console.error("error occured")
                        dialog.close()
                        reject((args as any).error)
                    }
                    else
                    {
                        let parsedArgs = JSON.parse((args as any).message)
                        let accessToken: AuthenticationResult = parsedArgs.result
                        dialog.close() 
                        accept(accessToken.idToken)
                    }
                })
            }
        })       
    }
    
    //uses MSAL for login for excel online
    async function loginExcelOnline(instance: IPublicClientApplication)
    {
        console.log("Popup fired - Online")
        return new Promise<string>((accept, reject) => {
            instance.loginPopup(loginRequest).then(res => {
                console.log(res)
                accept(res.idToken)
            }).catch(e => {
                reject(e)
            })
        })
        
        
    }

    export function msLogin(instance: IPublicClientApplication)
    {
        if(window.top === window){ // the add-in is not running in Excel Online
            
            return loginStandalone()
        }
        else //is running in excel online
        {
            return loginExcelOnline(instance)

        }
    }