import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter";
import { executingSigningInNotification } from "../port/interactors/SigningInUserNotificationInteractorContract";
import {signingInNotificationStore as signingInNotificationStore} from "../stores/signInStore"
export const signingIn = (userInputUsername:string,userInputPassword:string):void => {
    signingInNotificationStore.set(executingSigningInNotification)
    setTimeout(() => {
        //connectedUserStore.set({id:"0",username:"johnDoe"})
        uiBangarangUserBuilder
            .withUserContract({username:userInputUsername,fullname:"",email:""})
            .resetUser()
            .signingIn(userInputPassword)
    }, signInFakeWaitingTime);
}
const signInFakeWaitingTime = 500;