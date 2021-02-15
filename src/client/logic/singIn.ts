import { connectedUserStore } from "../stores/connectedUserStore"
import {signInStore} from "../stores/signInStore"
export const signIn = (userInputUsername:string,userInputPassword:string):void => {
    signInStore.set({signInStatus:"signing in"})
    setTimeout(() => {
        connectedUserStore.set({id:"0",username:"johnDoe"})
        signed()
    }, signInFakeWaitingTime);
}
const signed = ():void => {
    signInStore.set({signInStatus:"signed in"})
    setTimeout(()=>signInStore.set({signInStatus:"nothing"}),timeOfSignedNotification)
}
const timeOfSignedNotification = 1500
const signInFakeWaitingTime = 500;