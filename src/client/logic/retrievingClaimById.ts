import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter"
import { retrievingClaimUserNotificationStore } from "../stores/retrievingClaimStore"
import { executingRetrievingClaimUserNotification } from "../port/interactors/RetrievingClaimUserNotificationInteractorContract"
export const retrievingClaimById = (claimId:string):void => {
    retrievingClaimUserNotificationStore.set(executingRetrievingClaimUserNotification)
    uiBangarangUserBuilder.getUser().retrievingClaimById(claimId)
}


