import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter";
import { executingSigningInNotification } from "../port/interactors/SigningInUserNotificationInteractorContract";
import { currentUserContractStore } from "../stores/currentUserContract";
import {signingInNotificationStore as signingInNotificationStore} from "../stores/signInStore"
export const signingIn = (userInputUsername:string,userInputPassword:string):void => {
    signingInNotificationStore.set(executingSigningInNotification)
    uiBangarangUserBuilder
        .getUser()
        .signingIn(userInputUsername,userInputPassword)
        .then(()=> currentUserContractStore.set(uiBangarangUserBuilder.getUser().retrieveSignedInUserContract()))
}
