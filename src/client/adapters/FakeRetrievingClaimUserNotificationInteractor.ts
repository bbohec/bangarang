import type { RetrievingClaimUserNotificationInteractorContract, RetrievingClaimUserNotificationContract } from "../port/interactors/RetrievingClaimUserNotificationInteractorContract";
export class FakeRetrievingClaimUserNotificationInteractor implements RetrievingClaimUserNotificationInteractorContract {
    resetNotification(): void {
        this.currentUserNotification = undefined;
    }
    public notify(userNotification: RetrievingClaimUserNotificationContract): void {
        this.currentUserNotification = userNotification;
    }
    public currentUserNotification: RetrievingClaimUserNotificationContract | undefined;
}
