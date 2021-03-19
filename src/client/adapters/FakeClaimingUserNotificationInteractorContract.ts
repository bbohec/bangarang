import type { ClaimingUserNotificationInteractorContract, ClaimingUserNotificationContract } from "../port/interactors/ClaimingUserNotificationInteractorContract";
export class FakeClaimingUserNotificationInteractor implements ClaimingUserNotificationInteractorContract {
    notify(userNotification: ClaimingUserNotificationContract): void {
        this.currentUserNotification = userNotification;
    }
    public currentUserNotification: ClaimingUserNotificationContract | undefined;
}
