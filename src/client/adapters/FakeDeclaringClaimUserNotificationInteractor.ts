import type { DeclaringClaimUserNotificationInteractorContract, DeclaringClaimUserNotificationContract } from "../port/interactors/DeclaringClaimUserNotificationInteractorContract";
export class FakeDeclaringClaimUserNotificationInteractor implements DeclaringClaimUserNotificationInteractorContract {
    public notify(userNotification: DeclaringClaimUserNotificationContract): void {
        this.currentUserNotification = userNotification;
    }
    public currentUserNotification: DeclaringClaimUserNotificationContract | undefined;
}
