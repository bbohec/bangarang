import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter";
import { executingMemberRegisteringUserNotification } from "../port/interactors/RegisteringUserNotificationInteractorContract";
import type { UserContract } from "../port/UserContact";
import { registeringUserNotificationStore } from "../stores/registeringStore";
export const registering = (userContract:UserContract,userpassword:string):void => {
    registeringUserNotificationStore.set(executingMemberRegisteringUserNotification)
    uiBangarangUserBuilder
            .withUserContract(userContract)
            .resetUser()
            .registering(userpassword)
    uiBangarangUserBuilder
            .withUserContract({username:"guest",fullname:"",email:""})
            .resetUser()
}
