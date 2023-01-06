import { IPublicClientApplication, EndSessionPopupRequest } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import useLocation from "wouter/use-location"
import { ERoutes } from "../App"
import { msLogin } from "../services/Account.service";
import StandardButton from "../ui/StandardButton";
import { trpc } from "../utils/trpc";
import { useAccountStore } from "../zustand/accountStore";

const Login: React.FC = () => {

    const [, setLocation] = useLocation()
    const ZF_setBearer = useAccountStore(store => store.reducers.setBearer)
    const ZF_setWorkspaceId = useAccountStore(store => store.reducers.setWorkspaceId)

    const doesWorkspaceExist = trpc.workspaces.doesWorkspaceExist.useMutation({
      onSuccess: (data) => {
        console.log(data)
        setLocation(ERoutes.Trip)
      }
    })

    const loginMs = trpc.auth.loginMs.useMutation({
      onSuccess: async (data) => {
        console.log(data)
        ZF_setBearer(data.accessToken)
        ZF_setWorkspaceId(data.lastUsedWorkspaceId)
        doesWorkspaceExist.mutate({workspaceId: data.lastUsedWorkspaceId})
      },
    })



    const msalContext = useMsal();

    async function loginUserWithMsAccount(instance: IPublicClientApplication) {
      msLogin(instance)
      .then(identityToken => {
        console.log(identityToken)
        loginMs.mutate({idToken: identityToken})
      })
    }
  
    function signOutClickHandler(instance: IPublicClientApplication) {
      const logoutRequest: EndSessionPopupRequest = {
        authority: undefined,
        mainWindowRedirectUri: "https://localhost:3000/",
        postLogoutRedirectUri: "https://localhost:3000/",
      };
      instance.logoutPopup(logoutRequest);
    }
    
    return(
        <div>
            <div>Login Screen</div>
            <StandardButton onClick={() => setLocation(ERoutes.Workspaces)}>To Workspaces</StandardButton>
            <StandardButton onClick={() => {loginUserWithMsAccount(msalContext.instance)}}>MS login</StandardButton>
            <StandardButton onClick={() => {signOutClickHandler(msalContext.instance)}}>MS Logout</StandardButton>
        </div>
    )
}

export default Login