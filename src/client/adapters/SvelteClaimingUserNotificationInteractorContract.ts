import { ClaimingUserNotificationInteractorContract, ClaimingUserNotificationContract, idleClaimingUserNotification } from "../port/interactors/ClaimingUserNotificationInteractorContract";
import { claimingUserNotificationStore } from "../stores/claimingStore";
export class SvelteClaimingUserNotificationInteractor implements ClaimingUserNotificationInteractorContract {
    notify(userNotification: ClaimingUserNotificationContract): void {
        const timeOfClaimedNotification = 1500
        claimingUserNotificationStore.set(userNotification)
        setTimeout(()=>claimingUserNotificationStore.set(idleClaimingUserNotification),timeOfClaimedNotification)
    }
}
