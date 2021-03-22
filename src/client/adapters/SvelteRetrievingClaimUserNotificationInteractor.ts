import { RetrievingClaimUserNotificationInteractorContract, RetrievingClaimUserNotificationContract, idleRetrievingClaimUserNotification } from "../port/interactors/RetrievingClaimUserNotificationInteractorContract";
import { retrievingClaimUserNotificationStore } from "../stores/retrievingClaimStore";
export class SvelteRetrievingClaimUserNotificationInteractor implements RetrievingClaimUserNotificationInteractorContract {
    notify(userNotification: RetrievingClaimUserNotificationContract): void {
        const timeOfClaimRetrievingNotification = 1500
        retrievingClaimUserNotificationStore.set(userNotification)
        setTimeout(()=>retrievingClaimUserNotificationStore.set(idleRetrievingClaimUserNotification),timeOfClaimRetrievingNotification)
    }
}
