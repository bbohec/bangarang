import { claimingUserNotificationStore } from "../stores/claimingStore"
import { executingClaimingUserNotification } from "../port/interactors/ClaimingUserNotificationInteractorContract"
import { uiBangarangUserBuilder } from "../adapters/uiPrimaryAdapter"
import type { ClaimChoice } from "../port/ClaimChoice"
export const claiming = (claimTitle:string,claimChoice:ClaimChoice):void => {
    claimingUserNotificationStore.set(executingClaimingUserNotification)
    setTimeout(() => uiBangarangUserBuilder.getUser().claiming(claimTitle,claimChoice), claimingFakeWaitingTime);
}
const claimingFakeWaitingTime = 500;



