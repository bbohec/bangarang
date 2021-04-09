import { claimingUserNotificationStore } from "../stores/claimingStore"
import { executingClaimingUserNotification } from "../port/interactors/ClaimingUserNotificationInteractorContract"
import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter"
import type { ClaimChoice } from "../port/ClaimChoice"
export const claiming = (claimTitle:string,claimChoice:ClaimChoice):void => {
    claimingUserNotificationStore.set(executingClaimingUserNotification)
    uiBangarangUserBuilder.getUser().claiming(claimTitle,claimChoice)
}



