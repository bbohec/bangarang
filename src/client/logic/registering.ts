import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter";
import { executingMemberRegisteringUserNotification } from "../port/interactors/RegisteringUserNotificationInteractorContract";
import type { UserContract } from "../port/UserContact";
import { registeringUserNotificationStore } from "../stores/registeringStore";
export const registering = (userContract:UserContract,userpassword:string):void => {
    registeringUserNotificationStore.set(executingMemberRegisteringUserNotification)
    uiBangarangUserBuilder
            .getUser()
            .registering(userContract,userpassword)
}
