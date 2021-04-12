import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter";
import { executingSigningInNotification } from "../port/interactors/SigningInUserNotificationInteractorContract";
import {signingInNotificationStore as signingInNotificationStore} from "../stores/signInStore"
export const signingIn = (userInputUsername:string,userInputPassword:string):void => {
    signingInNotificationStore.set(executingSigningInNotification)
    uiBangarangUserBuilder
            .withUserContract({username:userInputUsername,fullname:"",email:""})
            .resetUser()
            .signingIn(userInputPassword)
}
