import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter"
import { retrievingClaimUserNotificationStore } from "../stores/retrievingClaimStore"
import { executingRetrievingClaimUserNotification } from "../port/interactors/RetrievingClaimUserNotificationInteractorContract"
export const retrievingClaimById = (claimId:string):Promise<void> => {
    retrievingClaimUserNotificationStore.set(executingRetrievingClaimUserNotification)
    return uiBangarangUserBuilder.getUser().retrievingClaimById(claimId)
}


